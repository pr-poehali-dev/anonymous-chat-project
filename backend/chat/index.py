import json
import os
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Бизнес: управление чат-сессиями и поиск собеседников
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                user_id = body_data.get('user_id')
                if not user_id:
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'}), 'isBase64Encoded': False}
                
                cur.execute(
                    "INSERT INTO users (id, rating, total_chats) VALUES (%s, 4.5, 0) ON CONFLICT (id) DO NOTHING",
                    (user_id,)
                )
                conn.commit()
                
                cur.execute("SELECT id, rating, total_chats, blocked_until FROM users WHERE id = %s", (user_id,))
                row = cur.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'id': row[0],
                        'rating': float(row[1]),
                        'totalChats': row[2],
                        'blockedUntil': row[3].isoformat() if row[3] else None
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'find_match':
                user_id = body_data.get('user_id')
                gender_preference = body_data.get('gender_preference', 'any')
                user_gender = body_data.get('user_gender', 'any')
                
                if not user_id:
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'}), 'isBase64Encoded': False}
                
                cur.execute("DELETE FROM waiting_queue WHERE user_id = %s", (user_id,))
                
                if gender_preference == 'any':
                    cur.execute(
                        "SELECT user_id, user_gender FROM waiting_queue WHERE user_id != %s AND (gender_preference = %s OR gender_preference = 'any') LIMIT 1",
                        (user_id, user_gender)
                    )
                else:
                    cur.execute(
                        "SELECT user_id, user_gender FROM waiting_queue WHERE user_id != %s AND user_gender = %s AND (gender_preference = %s OR gender_preference = 'any') LIMIT 1",
                        (user_id, gender_preference, user_gender)
                    )
                
                match = cur.fetchone()
                
                if match:
                    partner_id = match[0]
                    session_id = f"session_{datetime.now().timestamp()}"
                    
                    cur.execute("DELETE FROM waiting_queue WHERE user_id = %s", (partner_id,))
                    cur.execute(
                        "INSERT INTO chat_sessions (id, user1_id, user2_id, status) VALUES (%s, %s, %s, 'active')",
                        (session_id, user_id, partner_id)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({
                            'matched': True,
                            'session_id': session_id,
                            'partner_id': partner_id
                        }),
                        'isBase64Encoded': False
                    }
                else:
                    cur.execute(
                        "INSERT INTO waiting_queue (user_id, gender_preference, user_gender) VALUES (%s, %s, %s) ON CONFLICT (user_id) DO UPDATE SET gender_preference = EXCLUDED.gender_preference, user_gender = EXCLUDED.user_gender, joined_at = CURRENT_TIMESTAMP",
                        (user_id, gender_preference, user_gender)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({'matched': False, 'waiting': True}),
                        'isBase64Encoded': False
                    }
            
            elif action == 'send_message':
                session_id = body_data.get('session_id')
                sender_id = body_data.get('sender_id')
                message_text = body_data.get('message')
                
                if not all([session_id, sender_id, message_text]):
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Missing required fields'}), 'isBase64Encoded': False}
                
                cur.execute(
                    "INSERT INTO messages (session_id, sender_id, message_text) VALUES (%s, %s, %s) RETURNING id, created_at",
                    (session_id, sender_id, message_text)
                )
                row = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'message_id': row[0],
                        'timestamp': row[1].isoformat()
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'rate':
                session_id = body_data.get('session_id')
                rater_id = body_data.get('rater_id')
                rating = body_data.get('rating')
                
                if not all([session_id, rater_id, rating]):
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Missing required fields'}), 'isBase64Encoded': False}
                
                cur.execute("SELECT user1_id, user2_id FROM chat_sessions WHERE id = %s", (session_id,))
                session = cur.fetchone()
                
                if not session:
                    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Session not found'}), 'isBase64Encoded': False}
                
                rated_id = session[1] if session[0] == rater_id else session[0]
                
                cur.execute(
                    "INSERT INTO ratings (session_id, rater_id, rated_id, rating) VALUES (%s, %s, %s, %s) ON CONFLICT (session_id, rater_id) DO UPDATE SET rating = EXCLUDED.rating",
                    (session_id, rater_id, rated_id, rating)
                )
                
                cur.execute("SELECT AVG(rating), COUNT(*) FROM ratings WHERE rated_id = %s", (rated_id,))
                avg_result = cur.fetchone()
                
                if avg_result and avg_result[0]:
                    cur.execute(
                        "UPDATE users SET rating = %s, total_chats = %s WHERE id = %s",
                        (float(avg_result[0]), int(avg_result[1]), rated_id)
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'end_session':
                session_id = body_data.get('session_id')
                user_id = body_data.get('user_id')
                
                if not session_id:
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'session_id required'}), 'isBase64Encoded': False}
                
                cur.execute("UPDATE chat_sessions SET status = 'ended', ended_at = CURRENT_TIMESTAMP WHERE id = %s", (session_id,))
                cur.execute("DELETE FROM waiting_queue WHERE user_id = %s", (user_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action')
            
            if action == 'get_messages':
                session_id = params.get('session_id')
                since_id = params.get('since_id', '0')
                
                if not session_id:
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'session_id required'}), 'isBase64Encoded': False}
                
                cur.execute(
                    "SELECT id, sender_id, message_text, created_at FROM messages WHERE session_id = %s AND id > %s ORDER BY id ASC",
                    (session_id, int(since_id))
                )
                
                messages = []
                for row in cur.fetchall():
                    messages.append({
                        'id': row[0],
                        'sender_id': row[1],
                        'text': row[2],
                        'timestamp': row[3].isoformat()
                    })
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'messages': messages}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_profile':
                user_id = params.get('user_id')
                
                if not user_id:
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'}), 'isBase64Encoded': False}
                
                cur.execute("SELECT id, rating, total_chats, blocked_until FROM users WHERE id = %s", (user_id,))
                row = cur.fetchone()
                
                if not row:
                    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'User not found'}), 'isBase64Encoded': False}
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'id': row[0],
                        'rating': float(row[1]),
                        'totalChats': row[2],
                        'blockedUntil': row[3].isoformat() if row[3] else None
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
