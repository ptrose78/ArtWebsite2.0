import jwt from 'jsonwebtoken';

export async function GET(req) {
    const refreshToken = req.headers.get('cookie')?.split('refreshToken=')?.[1];
    if (!refreshToken) {
        console.log('no refresh token')
        return new Response('Refresh token missing', { status: 401 });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string };

        // Generate a new access token
        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET as string, { expiresIn: '30m' });

        // Return the new access token in the response
        return new Response(JSON.stringify({ accessToken: newAccessToken }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response('Invalid refresh token', { status: 401 });
    }
}
