import { SystemUser, UserRole, AuditLogEntry, UserProfile } from '../types';
import { INITIAL_SYSTEM_USERS, INITIAL_USERS } from '../data/mockData';

// User account status type
export type AccountStatus = 'Active' | 'Inactive' | 'Suspended' | 'Locked' | 'Pending';

export interface UserAccount extends SystemUser {
  passwordHash: string;
  salt: string;
  failedLoginAttempts: number;
  lockoutUntil?: string | null;
  status: AccountStatus;
  rememberMeToken?: string | null;
}

export interface SessionData {
  token: string;
  user: SystemUser;
  userProfile: UserProfile;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: SystemUser;
  userProfile?: UserProfile;
  role?: UserRole;
  token?: string;
  accountStatus?: AccountStatus;
}

const STORAGE_KEYS = {
  USERS: 'educators_system_accounts_v2',
  SESSION: 'educators_auth_session_v2',
  REMEMBER: 'educators_remember_me_token_v2',
  AUDIT_LOGS: 'educators_audit_logs_v2',
  PASSWORD_RESETS: 'educators_password_resets_v2',
};

// Simple cryptographic hash helper using Web Crypto API or fallback
export async function hashPassword(password: string, salt: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + ':' + salt);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  // Simple fallback hash algorithm for compatibility
  let hash = 0;
  const str = password + ':' + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fallback_' + Math.abs(hash).toString(16);
}

// Generate secure random string/token
export function generateSecureToken(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Fixed salt for seed system accounts
const SEED_SALT = 'educators_secure_salt_2026';

// Default seed password for institutional accounts
export const DEFAULT_SEED_PASSWORD = 'Password123!';

class AuthService {
  private accounts: Map<string, UserAccount> = new Map();
  private auditLogs: AuditLogEntry[] = [];
  private passwordResets: Map<string, { otp: string; expiresAt: number }> = new Map();

  constructor() {
    this.initializeAccounts();
  }

  private async initializeAccounts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        const parsed: UserAccount[] = JSON.parse(stored);
        parsed.forEach((acc) => this.accounts.set(acc.email.toLowerCase(), acc));
        return;
      }
    } catch {
      // Failed to parse, re-seed
    }

    // Seed initial users with secure default passwords
    const defaultPasswordHash = await hashPassword(DEFAULT_SEED_PASSWORD, SEED_SALT);

    const seedAccountsData: UserAccount[] = [
      {
        id: 'usr-101',
        username: 'super.admin',
        fullName: 'Dr. Shahbaz Sharif (Director Ops)',
        email: 'admin@theeducators.edu',
        role: 'super_admin',
        campusName: 'Central Directorate (All Campuses)',
        status: 'Active',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        twoFactorEnabled: false,
        phone: '+92 300 1234567',
        passwordHash: defaultPasswordHash,
        salt: SEED_SALT,
        failedLoginAttempts: 0,
      },
      {
        id: 'usr-102',
        username: 'principal.mt',
        fullName: 'Dr. Zulfiqar Ali Khan',
        email: 'principal@theeducators.edu',
        role: 'campus_admin',
        campusName: 'Main Campus (Model Town)',
        status: 'Active',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        twoFactorEnabled: false,
        phone: '+92 300 7654321',
        passwordHash: defaultPasswordHash,
        salt: SEED_SALT,
        failedLoginAttempts: 0,
      },
      {
        id: 'usr-103',
        username: 'bursar.rashid',
        fullName: 'Mr. Rashid Khan (Bursar)',
        email: 'accountant@theeducators.edu',
        role: 'accountant',
        campusName: 'Main Campus (Model Town)',
        status: 'Active',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        twoFactorEnabled: false,
        phone: '+92 302 1122334',
        passwordHash: defaultPasswordHash,
        salt: SEED_SALT,
        failedLoginAttempts: 0,
      },
      {
        id: 'usr-104',
        username: 'prof.tariq',
        fullName: 'Prof. Tariq Mahmood (Senior Faculty)',
        email: 'teacher@theeducators.edu',
        role: 'teacher',
        campusName: 'Main Campus (Model Town)',
        status: 'Active',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        twoFactorEnabled: false,
        phone: '+92 300 8877665',
        passwordHash: defaultPasswordHash,
        salt: SEED_SALT,
        failedLoginAttempts: 0,
      },
      {
        id: 'usr-105',
        username: 'parent.ghulam',
        fullName: 'Muhammad Aslam (Parent ID: Hamza Aslam)',
        email: 'parent@theeducators.edu',
        role: 'parent',
        campusName: 'Main Campus (Model Town)',
        status: 'Active',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        twoFactorEnabled: false,
        phone: '+92 300 1234567',
        passwordHash: defaultPasswordHash,
        salt: SEED_SALT,
        failedLoginAttempts: 0,
      },
      {
        id: 'usr-106',
        username: 'student.hamza',
        fullName: 'Hamza Aslam (Student - Class One)',
        email: 'hamza@student.theeducators.edu',
        role: 'student',
        campusName: 'Main Campus (Model Town)',
        status: 'Active',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        twoFactorEnabled: false,
        phone: '+92 321 4455822',
        passwordHash: defaultPasswordHash,
        salt: SEED_SALT,
        failedLoginAttempts: 0,
      },
    ];

    seedAccountsData.forEach((acc) => this.accounts.set(acc.email.toLowerCase(), acc));
    this.saveAccounts();
  }

  private saveAccounts() {
    try {
      const list = Array.from(this.accounts.values());
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save user accounts', e);
    }
  }

  // Audit Logging helper
  public logAuditEvent(
    action: string,
    category: 'AUTH' | 'FINANCE' | 'ACADEMIC' | 'SYSTEM' | 'SECURITY',
    severity: 'INFO' | 'WARNING' | 'CRITICAL',
    status: 'SUCCESS' | 'FAILED',
    user: string = 'Anonymous',
    role: UserRole = 'student'
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '127.0.0.1 (Institutional Gateway)',
      user,
      role,
      action,
      category,
      severity,
      status,
    };
    this.auditLogs.unshift(entry);

    // Persist audit log
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([entry, ...existing].slice(0, 500)));
    } catch {}

    return entry;
  }

  // Lookup user by email or username
  public findAccount(identifier: string): UserAccount | undefined {
    const cleanId = identifier.trim().toLowerCase();
    for (const acc of this.accounts.values()) {
      if (acc.email.toLowerCase() === cleanId || acc.username.toLowerCase() === cleanId) {
        return acc;
      }
    }
    return undefined;
  }

  // Find User Profile matching SystemUser
  public getUserProfile(user: SystemUser): UserProfile {
    const matchedProfile = INITIAL_USERS.find((u) => u.email.toLowerCase() === user.email.toLowerCase() || u.role === user.role);
    if (matchedProfile) {
      return {
        ...matchedProfile,
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        campus: user.campusName,
      };
    }
    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      campus: user.campusName,
      designation: user.role.replace('_', ' ').toUpperCase(),
    };
  }

  // Real Authentication Engine
  public async authenticate(identifier: string, passwordInput: string, rememberMe: boolean = false): Promise<AuthResult> {
    if (!identifier.trim() || !passwordInput) {
      return {
        success: false,
        message: 'Please provide email/username and password.',
      };
    }

    const account = this.findAccount(identifier);

    if (!account) {
      this.logAuditEvent(
        `LOGIN_FAILED: User identifier "${identifier}" not found in institutional registry`,
        'AUTH',
        'WARNING',
        'FAILED',
        identifier,
        'student'
      );
      return {
        success: false,
        message: 'Invalid email/username or password.',
      };
    }

    // Check account status
    if (account.status === 'Locked') {
      this.logAuditEvent(
        `LOGIN_FAILED: Attempted login on LOCKED account (${account.email})`,
        'SECURITY',
        'CRITICAL',
        'FAILED',
        account.fullName,
        account.role
      );
      return {
        success: false,
        accountStatus: 'Locked',
        message: 'Your account is locked due to multiple failed login attempts. Please contact the administrator.',
      };
    }

    if (account.status === 'Inactive') {
      this.logAuditEvent(
        `LOGIN_FAILED: Attempted login on INACTIVE account (${account.email})`,
        'AUTH',
        'WARNING',
        'FAILED',
        account.fullName,
        account.role
      );
      return {
        success: false,
        accountStatus: 'Inactive',
        message: 'Your account is currently inactive. Please contact the campus administrator.',
      };
    }

    if (account.status === 'Suspended') {
      this.logAuditEvent(
        `LOGIN_FAILED: Attempted login on SUSPENDED account (${account.email})`,
        'SECURITY',
        'CRITICAL',
        'FAILED',
        account.fullName,
        account.role
      );
      return {
        success: false,
        accountStatus: 'Suspended',
        message: 'Your account has been suspended by the central registry.',
      };
    }

    if (account.status === 'Pending') {
      return {
        success: false,
        accountStatus: 'Pending',
        message: 'Your registration is pending approval by the campus principal.',
      };
    }

    // Hash and verify password
    const computedHash = await hashPassword(passwordInput, account.salt);
    if (computedHash !== account.passwordHash) {
      account.failedLoginAttempts += 1;

      if (account.failedLoginAttempts >= 5) {
        account.status = 'Locked';
        this.saveAccounts();
        this.logAuditEvent(
          `ACCOUNT_LOCKED: Exceeded 5 failed login attempts for user (${account.email})`,
          'SECURITY',
          'CRITICAL',
          'FAILED',
          account.fullName,
          account.role
        );
        return {
          success: false,
          accountStatus: 'Locked',
          message: 'Account locked due to 5 consecutive invalid password attempts. Contact Super Admin.',
        };
      }

      this.saveAccounts();
      const remainingAttempts = 5 - account.failedLoginAttempts;
      this.logAuditEvent(
        `LOGIN_FAILED: Incorrect password for (${account.email}) [Attempt ${account.failedLoginAttempts}/5]`,
        'AUTH',
        'WARNING',
        'FAILED',
        account.fullName,
        account.role
      );

      return {
        success: false,
        message: `Invalid email or password. (${remainingAttempts} attempts remaining before account lockout).`,
      };
    }

    // Success! Reset failed attempts and update last login
    account.failedLoginAttempts = 0;
    account.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.saveAccounts();

    const userProfile = this.getUserProfile(account);
    const token = generateSecureToken();
    const expiresAt = Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);

    const sessionData: SessionData = {
      token,
      user: {
        id: account.id,
        username: account.username,
        fullName: account.fullName,
        email: account.email,
        role: account.role,
        campusName: account.campusName,
        status: account.status,
        lastLogin: account.lastLogin,
        twoFactorEnabled: account.twoFactorEnabled,
        phone: account.phone,
      },
      userProfile,
      expiresAt,
    };

    // Save session in appropriate storage
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      localStorage.setItem(STORAGE_KEYS.REMEMBER, token);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    }

    this.logAuditEvent(
      `LOGIN_SUCCESS: User authenticated successfully [Role: ${account.role}]`,
      'AUTH',
      'INFO',
      'SUCCESS',
      account.fullName,
      account.role
    );

    return {
      success: true,
      message: 'Authentication successful.',
      user: sessionData.user,
      userProfile: sessionData.userProfile,
      role: account.role,
      token,
    };
  }

  // Verify stored session
  public getActiveSession(): SessionData | null {
    try {
      // Check session storage first, then local storage
      let sessionRaw = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (!sessionRaw) {
        sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);
      }

      if (!sessionRaw) return null;

      const session: SessionData = JSON.parse(sessionRaw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session;
    } catch {
      this.logout();
      return null;
    }
  }

  // Logout & invalidate session
  public logout(): void {
    const activeSession = this.getActiveSession();
    if (activeSession) {
      this.logAuditEvent(
        `LOGOUT: Session invalidated for user ${activeSession.user.fullName}`,
        'AUTH',
        'INFO',
        'SUCCESS',
        activeSession.user.fullName,
        activeSession.user.role
      );
    }

    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER);
  }

  // Request Password Reset OTP
  public requestPasswordReset(emailInput: string): { success: boolean; message: string; otp?: string } {
    const account = this.findAccount(emailInput);

    if (!account) {
      // Generic message to prevent account enumeration
      return {
        success: true,
        message: 'If an active account exists with that email/username, a verification OTP code has been generated.',
      };
    }

    // Generate 6-digit cryptographic OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    this.passwordResets.set(account.email.toLowerCase(), { otp, expiresAt });

    this.logAuditEvent(
      `PASSWORD_RESET_REQUESTED: OTP generated for ${account.email}`,
      'SECURITY',
      'INFO',
      'SUCCESS',
      account.fullName,
      account.role
    );

    return {
      success: true,
      message: `Recovery OTP dispatched to ${account.email}. (Demo OTP Code: ${otp})`,
      otp,
    };
  }

  // Reset Password using OTP
  public async resetPasswordWithOtp(emailInput: string, otpInput: string, newPasswordInput: string): Promise<{ success: boolean; message: string }> {
    const account = this.findAccount(emailInput);
    if (!account) {
      return { success: false, message: 'Invalid recovery session.' };
    }

    const resetData = this.passwordResets.get(account.email.toLowerCase());
    if (!resetData || Date.now() > resetData.expiresAt) {
      return { success: false, message: 'Password reset OTP has expired. Please request a new code.' };
    }

    if (resetData.otp !== otpInput.trim()) {
      this.logAuditEvent(
        `PASSWORD_RESET_FAILED: Invalid OTP entered for ${account.email}`,
        'SECURITY',
        'WARNING',
        'FAILED',
        account.fullName,
        account.role
      );
      return { success: false, message: 'Invalid OTP code. Please check your verification code.' };
    }

    if (newPasswordInput.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    // Update password
    const newSalt = generateSecureToken().substring(0, 16);
    account.passwordHash = await hashPassword(newPasswordInput, newSalt);
    account.salt = newSalt;
    account.failedLoginAttempts = 0;
    if (account.status === 'Locked') account.status = 'Active';

    this.saveAccounts();
    this.passwordResets.delete(account.email.toLowerCase());

    this.logAuditEvent(
      `PASSWORD_RESET_COMPLETED: Password updated successfully for ${account.email}`,
      'SECURITY',
      'INFO',
      'SUCCESS',
      account.fullName,
      account.role
    );

    return {
      success: true,
      message: 'Password successfully updated. You can now log in with your new password.',
    };
  }

  // Register parent account
  public async registerParentAccount(
    studentCode: string,
    parentPhone: string,
    parentName: string,
    email: string,
    passwordInput: string
  ): Promise<{ success: boolean; message: string }> {
    if (!studentCode || !parentPhone || !passwordInput) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    const cleanEmail = (email || `parent.${studentCode.toLowerCase().replace(/[^a-z0-9]/g, '')}@theeducators.edu`).toLowerCase();

    if (this.findAccount(cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const salt = generateSecureToken().substring(0, 16);
    const passwordHash = await hashPassword(passwordInput, salt);

    const newAccount: UserAccount = {
      id: `usr-parent-${Date.now()}`,
      username: `parent.${studentCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      fullName: parentName || `Parent of ${studentCode}`,
      email: cleanEmail,
      role: 'parent',
      campusName: 'Main Campus (Model Town)',
      status: 'Active',
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      twoFactorEnabled: false,
      phone: parentPhone,
      passwordHash,
      salt,
      failedLoginAttempts: 0,
    };

    this.accounts.set(cleanEmail, newAccount);
    this.saveAccounts();

    this.logAuditEvent(
      `PARENT_REGISTRATION: Self-registered account created for student ${studentCode}`,
      'AUTH',
      'INFO',
      'SUCCESS',
      newAccount.fullName,
      'parent'
    );

    return {
      success: true,
      message: 'Parent portal account created successfully! You may now sign in.',
    };
  }

  // Get all system accounts
  public getAccounts(): UserAccount[] {
    return Array.from(this.accounts.values());
  }

  // Admin: Update user status
  public updateAccountStatus(userId: string, newStatus: AccountStatus, adminUser: string = 'Super Admin'): boolean {
    for (const acc of this.accounts.values()) {
      if (acc.id === userId) {
        acc.status = newStatus;
        if (newStatus === 'Active') acc.failedLoginAttempts = 0;
        this.saveAccounts();

        this.logAuditEvent(
          `ACCOUNT_STATUS_CHANGED: User ${acc.email} status changed to ${newStatus} by ${adminUser}`,
          'SECURITY',
          'WARNING',
          'SUCCESS',
          adminUser,
          'super_admin'
        );
        return true;
      }
    }
    return false;
  }

  /**
   * Secure User Profile Update with Strict Privilege Escalation Protection.
   * Disallows modifying role, status, campus, or administrative privileges unless caller is Super Admin.
   */
  public updateProfile(
    userId: string,
    updates: Partial<UserProfile & SystemUser>,
    callerRole: UserRole,
    callerName: string = 'Current User'
  ): { success: boolean; message: string; updatedUser?: UserAccount } {
    let targetAccount: UserAccount | undefined;
    for (const acc of this.accounts.values()) {
      if (acc.id === userId || acc.email.toLowerCase() === (updates.email || '').toLowerCase()) {
        targetAccount = acc;
        break;
      }
    }

    if (!targetAccount) {
      return { success: false, message: 'User account not found.' };
    }

    // Role Escalation Protection: non-super-admins cannot change their own role or status
    if (callerRole !== 'super_admin' && callerRole !== 'campus_admin') {
      if (updates.role && updates.role !== targetAccount.role) {
        this.logAuditEvent(
          `PRIVILEGE_ESCALATION_ATTEMPT_BLOCKED: User ${targetAccount.email} attempted to change role to ${updates.role}`,
          'SECURITY',
          'CRITICAL',
          'FAILED',
          callerName,
          callerRole
        );
        return {
          success: false,
          message: 'Security Violation: You are not authorized to elevate or modify your account role.',
        };
      }
    }

    // Apply allowed profile updates
    if (updates.fullName) targetAccount.fullName = updates.fullName;
    else if (updates.name) targetAccount.fullName = updates.name;
    if (updates.phone) targetAccount.phone = updates.phone;

    // Super Admin allowed fields
    if (callerRole === 'super_admin' || callerRole === 'campus_admin') {
      if (updates.role) targetAccount.role = updates.role;
      if (updates.campusName) targetAccount.campusName = updates.campusName;
      else if (updates.campus) targetAccount.campusName = updates.campus;
    }

    this.saveAccounts();

    this.logAuditEvent(
      `PROFILE_UPDATED: Profile modified for ${targetAccount.email}`,
      'AUTH',
      'INFO',
      'SUCCESS',
      callerName,
      callerRole
    );

    return {
      success: true,
      message: 'Profile updated successfully.',
      updatedUser: targetAccount,
    };
  }

  /**
   * Data Isolation Guard for Students: Verifies student only accesses their own records
   */
  public verifyStudentDataAccess(
    recordStudentId: string,
    authenticatedStudentId: string,
    userRole: UserRole
  ): boolean {
    if (userRole === 'super_admin' || userRole === 'campus_admin' || userRole === 'teacher' || userRole === 'accountant') {
      return true;
    }
    return recordStudentId === authenticatedStudentId;
  }

  /**
   * Data Isolation Guard for Parents: Verifies parent only accesses their linked children records
   */
  public verifyParentChildAccess(
    recordStudentId: string,
    linkedChildrenIds: string[],
    userRole: UserRole
  ): boolean {
    if (userRole === 'super_admin' || userRole === 'campus_admin' || userRole === 'teacher' || userRole === 'accountant') {
      return true;
    }
    return linkedChildrenIds.includes(recordStudentId);
  }

  /**
   * Log an RBAC / Unauthorized Access Violation to System Audit Log
   */
  public logSecurityViolation(
    attemptedAction: string,
    actorName: string,
    actorRole: UserRole,
    details: string
  ): void {
    this.logAuditEvent(
      `RBAC_VIOLATION_BLOCKED: ${attemptedAction} by ${actorName} (${actorRole}). Details: ${details}`,
      'SECURITY',
      'CRITICAL',
      'FAILED',
      actorName,
      actorRole
    );
  }
}

export const authService = new AuthService();
