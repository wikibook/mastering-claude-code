import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// TextEncoder/TextDecoder 폴리필 (Node.js 환경용)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
