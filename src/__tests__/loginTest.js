import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import App from '../App';

/**
 * @author Phipson Lee
 * @date 02-18-2020
 */

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 1: Verifying correct app initialization', () => {
    const { queryByTestId } = render(<App/>);

    /**
     * Google Maps should be visible by default
     * All navigation menu items should be available
     * Drawer should be closed (and the button is thus visible)
     * Dialog box should also be invisible
     */
    expect(queryByTestId('dashboard')).toBeNull();
    expect(queryByTestId('login-div')).toBeVisible();
    expect(queryByTestId('register')).toBeNull();
});

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 2: Check switch from login to register', () => {
    const { queryByTestId } = render(<App/>);

    /**
     * Google Maps should be visible by default
     * All navigation menu items should be available
     * Drawer should be closed (and the button is thus visible)
     * Dialog box should also be invisible
     */
    fireEvent.click(queryByTestId('create-account'));
    expect(queryByTestId('dashboard')).toBeNull();
    expect(queryByTestId('login-div')).toBeNull();
    expect(queryByTestId('register')).toBeVisible();

    fireEvent.click(queryByTestId('login-account'));
    expect(queryByTestId('dashboard')).toBeNull();
    expect(queryByTestId('login-div')).toBeVisible();
    expect(queryByTestId('register')).toBeNull();
});

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 3: Check inputs for login', () => {
    const { queryByTestId } = render(<App/>);

    /**
     * Google Maps should be visible by default
     * All navigation menu items should be available
     * Drawer should be closed (and the button is thus visible)
     * Dialog box should also be invisible
     */
    fireEvent.change(queryByTestId('login-email').querySelector('input'), {
        target: {value: 'Email'}
    });
    expect(queryByTestId('login-email').querySelector('input').value).toBe('Email');

    fireEvent.change(queryByTestId('login-password').querySelector('input'), {
        target: {value: 'Password'}
    });
    expect(queryByTestId('login-password').querySelector('input').value).toBe('Password');
});

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 4: Check inputs for registration', () => {
    const { queryByTestId } = render(<App/>);

    fireEvent.click(queryByTestId('create-account'));
    fireEvent.change(queryByTestId('register-first').querySelector('input'), {
        target: {value: 'First'}
    });
    expect(queryByTestId('register-first').querySelector('input').value).toBe('First');

    fireEvent.change(queryByTestId('register-last').querySelector('input'), {
        target: {value: 'Last'}
    });
    expect(queryByTestId('register-last').querySelector('input').value).toBe('Last');

    fireEvent.change(queryByTestId('register-email').querySelector('input'), {
        target: {value: 'Email'}
    });
    expect(queryByTestId('register-email').querySelector('input').value).toBe('Email');

    fireEvent.change(queryByTestId('register-phone').querySelector('input'), {
        target: {value: 'Phone'}
    });
    expect(queryByTestId('register-phone').querySelector('input').value).toBe('Phone');

    fireEvent.change(queryByTestId('register-password').querySelector('input'), {
        target: {value: 'Password'}
    });
    expect(queryByTestId('register-password').querySelector('input').value).toBe('Password');
});