import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import Dashboard from '../mainUI/Dashboard';

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 1: Verifying correct dashboard initialization', () => {
    const { getByText, queryByTestId } = render(<Dashboard/>);

    /**
     * Google Maps should be visible by default
     * All navigation menu items should be available
     * Drawer should be closed (and the button is thus visible)
     * Dialog box should also be invisible
     */
    expect(queryByTestId('Map')).toBeVisible();
    expect(getByText('Event Map')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();
    expect(getByText('Your Events')).toBeInTheDocument();
    expect(getByText('Write Reviews')).toBeInTheDocument();
    expect(getByTestId('hamburger-button')).toBeVisible();

    /**
     * Verify that other components not rendered are not visible
     */
    expect(queryByTestId('Events')).toBeNull();
    expect(queryByTestId('Profile')).toBeNull();
    expect(queryByTestId('Ratings')).toBeNull();
})

/**
 * @test Testing behavior on pressing iconbar button for navigation
 */
test('Test 2: Pressing Toolbar Button on Dashboard', () => {
    const { queryByTestId, getByText } = render(<Dashboard/>);
    
    /**
     * Open drawer and button should change state but rest should remain the same
     */
    fireEvent.click(queryByTestId('hamburger-button'));
    expect(queryByTestId('Map')).toBeVisible();
    expect(getByText('Event Map')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();
    expect(getByText('Your Events')).toBeInTheDocument();
    expect(getByText('Write Reviews')).toBeInTheDocument();
    expect(queryByTestId('hamburger-button')).not.toBeVisible();

    /**
     * Click on returning drawer button and the icon button should be visible again
     */
    fireEvent.click(queryByTestId('left-button'));
    expect(queryByTestId('Map')).toBeVisible();
    expect(getByText('Event Map')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();
    expect(getByText('Your Events')).toBeInTheDocument();
    expect(getByText('Write Reviews')).toBeInTheDocument();
    expect(queryByTestId('hamburger-button')).toBeVisible();
})

test('Test 3: Switching between Components', () => {
    const { queryByTestId, getByText } = render(<Dashboard/>);
    
    /**
     * Open drawer and button should change state but rest should remain the same
     */
    fireEvent.click(getByTestId('hamburger-button'));
    expect(getByTestId('Map')).toBeVisible();
    expect(getByText('Event Map')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();
    expect(getByText('Your Events')).toBeInTheDocument();
    expect(getByText('Write Reviews')).toBeInTheDocument();
    expect(getByTestId('hamburger-button')).not.toBeVisible();

    /**
     * Click on returning drawer button and the icon button should be visible again
     */
    fireEvent.click(getByTestId('left-button'));
    expect(getByTestId('Map')).toBeVisible();
    expect(getByText('Event Map')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();
    expect(getByText('Your Events')).toBeInTheDocument();
    expect(getByText('Write Reviews')).toBeInTheDocument();
    expect(getByTestId('hamburger-button')).toBeVisible();
})