import crypto from 'crypto'

// Base64 编码
export function base64Encode(str: string): string {
    return Buffer.from(str).toString('base64')
}

// HmacSHA256 加密
export function hmacSha256Encode(str: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(str).digest('hex')
}
