# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2025-01-08

### Added
- Add Reddit service with OAuth authentication
- Implement token refresh mechanism
- Add error handling with ServiceError class
- Create test files for Reddit and Instagram services
- Update error handling in Instagram service

### Changed
- New environment variables required for Reddit:
  - REDDIT_CLIENT_ID
  - REDDIT_CLIENT_SECRET
  - REDDIT_USERNAME
  - REDDIT_PASSWORD
  - REDDIT_SUBREDDIT

## [1.0.2] - 2025-01-06

### Added
- Instagram integration for tweets with images
- Automatic Instagram token refresh mechanism
- Token expiry monitoring and management
- Support for cross-posting images to Instagram Business Account
- Graceful shutdown handling for services

### Changed
- Improved error handling for all platforms
- Enhanced type definitions for Twitter API responses
- Refactored tweet processing logic for better modularity
- Updated environment variables documentation

### Fixed
- Rate limiting handling for multiple platforms
- Process cleanup on PM2 restart
- Type safety improvements in Twitter service

## [1.0.1] - 2025-01-02

### Added
- Discord integration support
- PM2 process management
- Modular project structure
- Progress bar visualization for wait times
- Comprehensive error handling system

### Changed
- Refactored project structure into modular services
- Split functionality into separate service classes
- Updated configuration management
- Enhanced logging system
- Improved rate limit handling

### Technical
- Added TypeScript configuration
- Implemented service-based architecture
- Added Discord.js integration
- Updated dependencies
- Added PM2 ecosystem configuration
