import { Component } from 'react';

export interface BMeetFactory {
    createMarker(name: string): void; 
}