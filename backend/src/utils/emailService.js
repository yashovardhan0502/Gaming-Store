import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Game Store Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to the Game Store! 🎮',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #ffffff; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #e94560; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Welcome, ${name}!</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; line-height: 1.5; color: #e0e0e0;">
                            We are thrilled to have you join our community. Get ready to explore the best and newest gaming titles in the world.
                        </p>
                        <p style="font-size: 16px; line-height: 1.5; color: #e0e0e0;">
                            Whether you're looking for an action-packed adventure, a casual puzzle, or to compete globally, our store has it all.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/games" style="background-color: #e94560; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                Start Exploring
                            </a>
                        </div>
                    </div>
                    <div style="background-color: #0f0f1a; padding: 15px; text-align: center; font-size: 12px; color: #888888;">
                        &copy; ${new Date().getFullYear()} Game Store. All rights reserved.
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending welcome email: ", error);
    }
};

export const sendOrderConfirmationEmail = async (email, name, items, totalAmount) => {
    try {
        const transporter = createTransporter();
        
        const itemsList = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #333;">${item.game.title}</td>
                <td style="padding: 10px; border-bottom: 1px solid #333; text-align: center;">${item.quantity}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Game Store Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Order Confirmation - Game Store',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #ffffff; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Order Confirmed! 🎉</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #e0e0e0;">Hello ${name},</p>
                        <p style="font-size: 16px; color: #e0e0e0;">Thank you for your purchase! Your order is confirmed and being processed.</p>
                        
                        <h3 style="color: #4CAF50; margin-top: 30px;">Order Summary</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; color: #ffffff;">
                            <thead>
                                <tr style="background-color: #0f0f1a;">
                                    <th style="padding: 10px; text-align: left;">Game</th>
                                    <th style="padding: 10px; text-align: center;">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                        </table>
                        
                        <div style="margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; color: #4CAF50;">
                            Total: $${totalAmount.toFixed(2)}
                        </div>
                    </div>
                    <div style="background-color: #0f0f1a; padding: 15px; text-align: center; font-size: 12px; color: #888888;">
                        &copy; ${new Date().getFullYear()} Game Store. Need help? Reply to this email.
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Order confirmation email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending order confirmation email: ", error);
    }
};
