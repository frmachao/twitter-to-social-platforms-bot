# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2024-01-06

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

## [1.0.1] - 2024-01-02

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

## [1.0.0] - 2024-01-01

### Added
- Initial release
- Twitter to Telegram forwarding
- Basic rate limit handling
- Environment variable configuration
- Simple logging system 