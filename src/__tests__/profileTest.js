import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent } from '@testing-library/react';
import Profile from '../mainUI/Profile/Profile';

/**
 * @author Phipson Lee
 * @date 02-18-2020
 */

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 1: Verifying correct app initialization', () => {
    const { getByText } = render(<Profile userID={{avgScore: []}}/>);

    expect(getByText("You haven't been rated yet")).toBeInTheDocument();
});

/**
 * @test To verify that the default screen that the dashboard is on is the GMaps component
 */
test('Test 2: Check Rating Rendering', () => {
    const { queryByText } = render(<Profile userID={{avgScore: 1}}/>);

    expect(queryByText("You haven't been rated yet")).not.toBeInTheDocument();
});