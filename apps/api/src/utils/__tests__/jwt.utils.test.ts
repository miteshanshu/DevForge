import { describe, it, expect } from 'vitest';
import { generateTokens, verifyAccessToken, verifyRefreshToken } from '../jwt.utils';

describe('JWT Utilities', () => {
  const mockUserId = '12345-uuid';
  const mockTokenVersion = 1;

  it('should generate access and refresh tokens', () => {
    const tokens = generateTokens(mockUserId, mockTokenVersion);
    
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should verify a valid access token', () => {
    const { accessToken } = generateTokens(mockUserId, mockTokenVersion);
    const decoded = verifyAccessToken(accessToken);
    
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(mockUserId);
  });

  it('should verify a valid refresh token', () => {
    const { refreshToken } = generateTokens(mockUserId, mockTokenVersion);
    const decoded = verifyRefreshToken(refreshToken);
    
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(mockUserId);
    expect(decoded?.tokenVersion).toBe(mockTokenVersion);
  });

  it('should return null for invalid access token', () => {
    const decoded = verifyAccessToken('invalid.token.string');
    expect(decoded).toBeNull();
  });
});
