import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import Dashboard from '../mainUI/Dashboard';

/**
 * @author Phipson Lee
 * @date 02-18-2020
 */

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
    expect(queryByTestId('hamburger-button')).toBeVisible();

    /**
     * Verify that other components not rendered are not visible
     * The events, profile, and ratings page should not be rendered at this point
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
     * The buttons to the menu bar should also be available, as indicated by the text
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
     * The buttons should still be available in the document, although they are hidden from view
     */
    fireEvent.click(queryByTestId('left-button'));
    expect(queryByTestId('Map')).toBeVisible();
    expect(getByText('Event Map')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();
    expect(getByText('Your Events')).toBeInTheDocument();
    expect(getByText('Write Reviews')).toBeInTheDocument();
    expect(queryByTestId('hamburger-button')).toBeVisible();
})

/**
 * @test Testing interface behavior when switching screens
 */
test('Test 3: Switching between Components', () => {
    const { queryByTestId } = render(<Dashboard/>);
    
    /**
     * Open drawer and navigate to Profile
     */
    fireEvent.click(queryByTestId('hamburger-button'));
    fireEvent.click(queryByTestId('profile-button'));

    /**
     * Only profile page should be visible
     */
    expect(queryByTestId('Profile')).toBeVisible();
    expect(queryByTestId('Map')).toBeNull();
    expect(queryByTestId('Events')).toBeNull();
    expect(queryByTestId('Ratings')).toBeNull();
    expect(queryByTestId('hamburger-button')).not.toBeVisible();

    /**
     * Navigate to Map
     * Only Map should be visible
     */
    fireEvent.click(queryByTestId('map-button'));
    expect(queryByTestId('Map')).toBeVisible();
    expect(queryByTestId('Profile')).toBeNull();
    expect(queryByTestId('Events')).toBeNull();
    expect(queryByTestId('Ratings')).toBeNull();
    expect(queryByTestId('hamburger-button')).not.toBeVisible();

    /**
     * Navigate to Events
     * Only Events should be visible
     */
    fireEvent.click(queryByTestId('events-button'));
    expect(queryByTestId('Events')).toBeVisible();
    expect(queryByTestId('Profile')).toBeNull();
    expect(queryByTestId('Map')).toBeNull();
    expect(queryByTestId('Ratings')).toBeNull();
    expect(queryByTestId('hamburger-button')).not.toBeVisible();

    /**
     * Navigate to Ratings
     * Only Ratings should be visible
     */
    fireEvent.click(queryByTestId('rating-button'));
    expect(queryByTestId('Ratings')).toBeVisible();
    expect(queryByTestId('Profile')).toBeNull();
    expect(queryByTestId('Events')).toBeNull();
    expect(queryByTestId('Map')).toBeNull();
    expect(queryByTestId('hamburger-button')).not.toBeVisible();

    /**
     * Click on returning drawer button and the icon button should be visible again
     * The menu bar should behave consistently regardless of where and when we press it
     */
    fireEvent.click(queryByTestId('left-button'));
    expect(queryByTestId('hamburger-button')).toBeVisible();
})

/**
 * @test Testing for visibility of dialog boxes without anything pressed
 * Issue with testing map: The Google Map interface is wrapped in as an object, so markers/UI events can't be tested
 */
test('Test 4: Verifying Dialog Boxes are Hidden', () => {
    const { queryByTestId } = render(<Dashboard/>);

    /**
     * Verify that the dialog box for the map is null upon initialization
     */
    expect(queryByTestId('map-dialog')).toBeNull();

    /**
     * TODO: Need to find alternative libraries to access Markers in Google Maps, as the current library 
     * is unable to query and click the markers in Google Map
     */

});