import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Polyfills
import { Buffer } from 'buffer';
import * as process from 'process';

// Make Buffer and process available globally
(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = Buffer;

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));