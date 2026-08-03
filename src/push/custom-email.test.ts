import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('nodemailer', () => ({
    __esModule: true,
    default: {
        createTransport: vi.fn(),
    },
}))

import nodemailer from 'nodemailer'
import { CustomEmail, type CustomEmailConfig } from './custom-email'

const mockedCreateTransport = vi.mocked(nodemailer.createTransport)

const emailConfig: CustomEmailConfig = {
    EMAIL_TYPE: 'text',
    EMAIL_TO_ADDRESS: 'to@example.com',
    EMAIL_AUTH_USER: 'from@example.com',
    EMAIL_AUTH_PASS: 'authpass123',
    EMAIL_HOST: 'smtp.example.com',
    EMAIL_PORT: 465,
}

describe('CustomEmail', () => {
    const mockedTransporter = {
        verify: vi.fn(),
        sendMail: vi.fn(),
        close: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockedCreateTransport.mockReturnValue(mockedTransporter as any)
        mockedTransporter.verify.mockResolvedValue(true)
        mockedTransporter.sendMail.mockResolvedValue({ response: '250 OK: queued as.' })
    })

    it('should validate config', () => {
        expect(() => new CustomEmail({ ...emailConfig, EMAIL_HOST: '' })).toThrow('"EMAIL_HOST" 字段是必须的！')
    })

    it('should create transporter with smtp config', () => {
        new CustomEmail(emailConfig)
        expect(mockedCreateTransport).toHaveBeenCalledTimes(1)
        expect(mockedCreateTransport).toHaveBeenCalledWith({
            host: 'smtp.example.com',
            port: 465,
            auth: {
                user: 'from@example.com',
                pass: 'authpass123',
            },
        })
    })

    it('should throw error when transporter verify fails', async () => {
        mockedTransporter.verify.mockResolvedValue(false)
        const customEmail = new CustomEmail(emailConfig)
        await expect(customEmail.send('测试标题', '测试内容')).rejects.toThrow('自定义邮件的发件配置无效')
    })

    it('should send text email and return 200 on 250 OK', async () => {
        const customEmail = new CustomEmail(emailConfig)
        const result = await customEmail.send('测试标题', '测试内容')
        expect(result.status).toBe(200)
        expect(result.data.response).toBe('250 OK: queued as.')
        expect(mockedTransporter.sendMail).toHaveBeenCalledWith({
            from: 'from@example.com',
            to: 'to@example.com',
            subject: '测试标题',
            text: '测试内容',
        })
    })

    it('should use option to override to address', async () => {
        const customEmail = new CustomEmail(emailConfig)
        await customEmail.send('测试标题', '测试内容', { to: 'custom@example.com' })
        expect(mockedTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
            to: 'custom@example.com',
        }))
    })

    it('should send html email when type is html', async () => {
        const customEmail = new CustomEmail({ ...emailConfig, EMAIL_TYPE: 'html' })
        await customEmail.send('测试标题', '<b>测试内容</b>')
        expect(mockedTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
            html: '<b>测试内容</b>',
        }))
    })

    it('should return 500 when response is not 250 OK', async () => {
        mockedTransporter.sendMail.mockResolvedValue({ response: '451 4.7.1 Try again later' })
        const customEmail = new CustomEmail(emailConfig)
        const result = await customEmail.send('测试标题', '测试内容')
        expect(result.status).toBe(500)
        expect(result.statusText).toBe('Internal Server Error')
    })

    it('should close transporter on dispose', () => {
        const customEmail = new CustomEmail(emailConfig)
        customEmail[Symbol.dispose]()
        expect(mockedTransporter.close).toHaveBeenCalledTimes(1)
    })
})
