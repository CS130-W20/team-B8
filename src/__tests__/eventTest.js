import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent, queryByText } from '@testing-library/react';
import EventList from '../mainUI/Events/EventList';
const io = require("socket.io-client"),
socket = io.connect("http://localhost:8000");

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
    const { getByText, queryByTestId } = render(<EventList socket={socket} events={[]}/>);

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
    const { queryByTestId, getByText} = render(<EventList socket={socket} events={[]}/>);
    
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
    fireEvent.change(queryByTestId('event-title').querySelector('input'), {
        target: {value: 'Test Event'}
    });
    expect(queryByTestId('event-title').querySelector('input').value).toBe('Test Event');

    fireEvent.change(queryByTestId('event-date').querySelector('input'), {
        target: {value: '03/08/2020'}
    });
    expect(queryByTestId('event-date').querySelector('input').value).toBe('03/08/2020');

    fireEvent.change(queryByTestId('event-time').querySelector('input'), {
        target: {value: '05:14 0'}
    });
    expect(queryByTestId('event-time').querySelector('input').value).toBe('05:14 0');
})