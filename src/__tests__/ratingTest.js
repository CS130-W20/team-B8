import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import EventHistory from '../mainUI/Rating/EventHistory';

/**
 * @author Phipson Lee
 * @date 02-18-2020
 */

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 1: Verifying correct app initialization', () => {
    const { queryByText, queryAllByText } = render(<EventHistory eventsFuture={[]}
                                               eventsPast={[]}/>);

    expect(queryByText("Your Upcoming Events")).toBeInTheDocument();
    expect(queryByText("Your Previous Events")).toBeInTheDocument();
    expect(queryAllByText("Date")).not.toBeNull();
    expect(queryAllByText("Name")).not.toBeNull();
    expect(queryAllByText("Location")).not.toBeNull();
    expect(queryAllByText("Time")).not.toBeNull();
    expect(queryAllByText("Attendees")).not.toBeNull();
    expect(queryByText("Reviews")).toBeInTheDocument();
    expect(queryByText("Actions")).toBeInTheDocument();
});