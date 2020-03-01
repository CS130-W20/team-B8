import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent, queryByText } from '@testing-library/react';
import EventList from '../mainUI/Events/EventList';

/**
 * @author Phipson Lee
 * @date 02-18-2020
 * Test scripts for different scenarios for EventList ReactJS Component
 * Currently in the process of modifying the EventList component itself 
 * such that 'dummy data' can be passed for further testing
 */

/**
 * @test To verify that the event table has been initialized correctly
 */
test('Test 1: Verifying Event Table Initialization', () => {
    const { getByText, queryByTestId } = render(<EventList/>);

    /**
     * Table headers should be visible by default
     * Dialog box should also be invisible
     */
    expect(queryByTestId('Events')).toBeVisible();
    expect(queryByTestId('event-row')).toBeNull();
    expect(getByText('Date')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Location')).toBeInTheDocument();
    expect(getByText('Time')).toBeInTheDocument();
    expect(getByText('Attendees')).toBeInTheDocument();

});

/**
 * @test Testing behavior upon pressing the "Host A New Event" Button
 */
test('Test 2: Testing Event Creation', () => {
    const { queryByTestId, getByText} = render(<EventList/>);
    
    /**
     * Click button and verify state is correct
     */
    fireEvent.click(queryByTestId('event-create-button'));
    expect(queryByTestId('event-create-dialog')).toBeVisible();
    expect(getByText('Create A New Event')).toBeInTheDocument();
    expect(getByText('Event Type')).toBeInTheDocument();

    /**
     * Update form and submit
     * Note: There are some limitations testing with date/time picker
     * Due to the fact that MaterialUI nests the elements it is currently unsupported/undocumented
     */
    fireEvent.change(queryByTestId('event-title'), {
        target: {value: 'Test Event'}
    });
    expect(queryByTestId('event-title').value).toBe('Test Event');

    /**
     * User should be able to select from the selection menu upon click
     */
    fireEvent.click(queryByTestId('event-select'));
    expect(queryByText('Rave')).not.toBeNull();
    expect(queryByText('House Party')).not.toBeNull();
    expect(queryByText('Music Concert/Festival')).not.toBeNull();
    expect(queryByText('Bar Hopping')).not.toBeNull();


    /**
     * After creating event, the dialog box should disappear
     */
    fireEvent.click(queryByTestId('event-create'));
    expect(getByText('Event Type')).toBeNull();
    expect(getByText('Create A New Event')).toBeNull();
})

/**
 * @test Testing interface behavior when editing events; Note that this will fail 
 * if there are no existing events in the Component
 */
test('Test 3: Testing Event Editing (Fails when there are no Events)', () => {
    const { queryByTestId, getByText} = render(<EventList/>);
    
    /**
     * Click button and verify state is correct
     */
    fireEvent.click(queryByTestId('event-edit-button'));
    expect(queryByTestId('event-edit-dialog')).toBeVisible();
    expect(getByText('Edit Event')).toBeInTheDocument();
    expect(getByText('Event Type')).toBeInTheDocument();

    /**
     * Update form and submit
     * Note: There are some limitations testing with date/time picker
     * Due to the fact that MaterialUI nests the elements it is currently unsupported/undocumented
     */
    fireEvent.change(queryByTestId('event-edit-title'), {
        target: {value: 'Edited Event'}
    });
    expect(queryByTestId('event-title').value).toBe('Edited Event');

    fireEvent.click(queryByTestId('event-edit-select'));
    expect(queryByTestId('event-edit-select')).not.toBeNull();

    fireEvent.click(queryByTestId('event-edit'));
    expect(getByText('Event Type')).toBeNull();
    expect(getByText('Edit Event')).toBeNull();
})

/**
 * @test Testing interface behavior when messaging attendees for an event; Note that this will fail 
 * if there are no existing events in the Component
 */
test('Test 4: Testing Event Message', () => {
    const { queryByTestId } = render(<EventList/>);

    fireEvent.click(queryByTestId('event-message-button'));
    expect(getByText('Send a Message to your Attendees')).toBeInTheDocument();

    fireEvent.change(queryByTestId('event-message-text'), {
        target: {value: 'New Message'}
    });
    expect(queryByTestId('event-message-text').value).toBe('New Message');

    fireEvent.click(queryByTestId('event-message'));
    expect(getByText('Send a Message to your Attendees')).toBeNull();
});

/**
 * @test Testing interface behavior when deleting events; Note that this will fail 
 * if there are no existing events in the Component
 */
test('Test 5: Testing Event Deletion', () => {
    const { queryByTestId } = render(<EventList/>);

    fireEvent.click(queryByTestId('event-delete-button'));
    expect(getByText('You are about to delete this event. You cannot undo this action. Would you wish to continue?')).toBeInTheDocument();

    fireEvent.click(queryByTestId('event-delete'));
    expect(getByText('You are about to delete this event. You cannot undo this action. Would you wish to continue?')).toBeNull();

});