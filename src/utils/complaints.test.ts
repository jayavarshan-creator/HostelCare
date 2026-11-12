import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterComplaintsForUser,
  calculateComplaintMetrics,
  validateComplaintSubmission,
  generateVerificationOtp,
  canTransitionStatus,
  validateUserRegistration,
  INITIAL_COMPLAINTS,
  DEMO_USERS,
} from './complaints';
import { User } from '../types';

test('filterComplaintsForUser - warden sees all complaints', () => {
  const warden = DEMO_USERS.find((u) => u.role === 'warden')!;
  const filtered = filterComplaintsForUser(INITIAL_COMPLAINTS, warden);
  assert.equal(filtered.length, INITIAL_COMPLAINTS.length);
});

test('filterComplaintsForUser - student sees only their own complaints', () => {
  const student = DEMO_USERS.find((u) => u.role === 'student')!;
  const filtered = filterComplaintsForUser(INITIAL_COMPLAINTS, student);
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((c) => c.studentId === student.id));
});

test('filterComplaintsForUser - electrician sees electricity tasks assigned or unassigned', () => {
  const electrician = DEMO_USERS.find((u) => u.id === 'EMP-ELEC-01')!;
  const filtered = filterComplaintsForUser(INITIAL_COMPLAINTS, electrician);
  assert.ok(filtered.length > 0);
  assert.ok(
    filtered.every(
      (c) => c.assignedEmployeeId === electrician.id || (c.category === 'electricity' && c.status === 'registered')
    )
  );
});

test('calculateComplaintMetrics accurately counts statuses and rate', () => {
  const metrics = calculateComplaintMetrics(INITIAL_COMPLAINTS);
  assert.equal(metrics.total, INITIAL_COMPLAINTS.length);
  assert.ok(metrics.completed >= 1);
  assert.ok(metrics.registered >= 1);
  assert.ok(metrics.resolutionRate >= 0 && metrics.resolutionRate <= 100);
});

test('validateComplaintSubmission catches missing or short fields', () => {
  const invalid = validateComplaintSubmission({
    category: '',
    title: 'ab',
    description: 'short',
    roomNumber: '',
    studentPhone: '123',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.category);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.description);
  assert.ok(invalid.errors.roomNumber);
  assert.ok(invalid.errors.studentPhone);

  const valid = validateComplaintSubmission({
    category: 'water',
    title: 'Leaking bathroom tap continuously',
    description: 'The cold water tap under the basin is dripping water on the floor.',
    roomNumber: 'B-304',
    studentPhone: '+91 98765 43210',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('canTransitionStatus requires employee assignment before scheduling', () => {
  const attemptWithoutEmp = canTransitionStatus('registered', 'scheduled', false);
  assert.equal(attemptWithoutEmp.allowed, false);

  const attemptWithEmp = canTransitionStatus('registered', 'scheduled', true);
  assert.equal(attemptWithEmp.allowed, true);

  const revertCompleted = canTransitionStatus('completed', 'registered', true);
  assert.equal(revertCompleted.allowed, false);
});

test('generateVerificationOtp produces 4-digit numeric code', () => {
  const otp = generateVerificationOtp();
  assert.equal(otp.length, 4);
  assert.match(otp, /^\d{4}$/);
});

test('validateUserRegistration validates student, warden, and employee roles', () => {
  // Student requires roomNumber
  const invalidStudent = validateUserRegistration({
    role: 'student',
    name: 'Maya',
    id: 'STU-99',
    email: 'maya@hostel.edu',
    phone: '+91 98000 11111',
  });
  assert.equal(invalidStudent.valid, false);
  assert.ok(invalidStudent.errors.roomNumber);

  const validStudent = validateUserRegistration({
    role: 'student',
    name: 'Maya Iyer',
    id: 'STU-99',
    email: 'maya@hostel.edu',
    phone: '+91 98000 11111',
    roomNumber: 'A-102',
  });
  assert.equal(validStudent.valid, true);

  // Warden requires designation
  const invalidWarden = validateUserRegistration({
    role: 'warden',
    name: 'Dr. Rao',
    id: 'WARDEN-05',
    email: 'rao@hostel.edu',
  });
  assert.equal(invalidWarden.valid, false);
  assert.ok(invalidWarden.errors.designation);

  const validWarden = validateUserRegistration({
    role: 'warden',
    name: 'Dr. Rao',
    id: 'WARDEN-05',
    email: 'rao@hostel.edu',
    designation: 'Deputy Warden',
  });
  assert.equal(validWarden.valid, true);

  // Employee requires employeeCategory trade
  const invalidEmployee = validateUserRegistration({
    role: 'employee',
    name: 'Karthik',
    id: 'EMP-09',
    email: 'karthik@hostel.edu',
  });
  assert.equal(invalidEmployee.valid, false);
  assert.ok(invalidEmployee.errors.employeeCategory);

  const validEmployee = validateUserRegistration({
    role: 'employee',
    name: 'Karthik Raman',
    id: 'EMP-09',
    email: 'karthik@hostel.edu',
    employeeCategory: 'electricity',
  });
  assert.equal(validEmployee.valid, true);
});
