# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.11.0...2.0.0) (2021-12-22)


### Features

* announce new features ([f646ad1](https://github.com/valentine195/obsidian-fantasy-calendar/commit/f646ad17e053fce27155de4360f5aa1f1b8b9b10))

## [1.11.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.10.2...1.11.0) (2021-12-22)


### Features

* can now specify date format ([5977b33](https://github.com/valentine195/obsidian-fantasy-calendar/commit/5977b33abe6645bc041b37a45acfd29282b38c4b))
* parse title for dates setting respected ([85b999e](https://github.com/valentine195/obsidian-fantasy-calendar/commit/85b999eb3f278ccf8cb25dd73104401aa2eead24))
* plugin will now parse note titles for dates if fc-date is not provided ([b99f2d2](https://github.com/valentine195/obsidian-fantasy-calendar/commit/b99f2d212dd6f1b61c4049ffb4bc9f18f3f77c45))


### Bug Fixes

* invalid months no longer break calendar ([659254a](https://github.com/valentine195/obsidian-fantasy-calendar/commit/659254a7f5f4c6efbfa75e6122b50b5189d1ce65))

### [1.10.2](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.10.1...1.10.2) (2021-12-20)


### Bug Fixes

* fc-calendar is no longer case sensitive ([3e81717](https://github.com/valentine195/obsidian-fantasy-calendar/commit/3e81717fe88c9e10f8aca457002b4d5f81a02aa6))
* fixed issue with calculating days between dates ([f323cce](https://github.com/valentine195/obsidian-fantasy-calendar/commit/f323cce333685a9f13fbfbcd4a0188ca1731ccbd))
* fixed issue with day view events not being removed (close [#23](https://github.com/valentine195/obsidian-fantasy-calendar/issues/23)) ([e64b1be](https://github.com/valentine195/obsidian-fantasy-calendar/commit/e64b1be67eeb76ef0f739af1d9d7a6bac7ae3db5))
* fixed multi-year events (close [#22](https://github.com/valentine195/obsidian-fantasy-calendar/issues/22)) ([01a1fdc](https://github.com/valentine195/obsidian-fantasy-calendar/commit/01a1fdcdf74750b713989aa54aae9123f9bd86d7))
* leap year offsets now work (close [#13](https://github.com/valentine195/obsidian-fantasy-calendar/issues/13)) ([368fa32](https://github.com/valentine195/obsidian-fantasy-calendar/commit/368fa32d0ee0547d5048822a95e1d54b8ef20cdb))

### [1.10.1](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.10.0...1.10.1) (2021-12-06)


### Bug Fixes

* fixed moon phase drift in calendars with intercalary months (close [#20](https://github.com/valentine195/obsidian-fantasy-calendar/issues/20)) ([eefb6bb](https://github.com/valentine195/obsidian-fantasy-calendar/commit/eefb6bb5fb631ce6cdf94c40f67ccab0c1d5e7d3))

## [1.10.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.9.0...1.10.0) (2021-12-05)


### Features

* added ability to display day number of year ([bb053a3](https://github.com/valentine195/obsidian-fantasy-calendar/commit/bb053a3cb0e9236c1db5d85cf650a6f0b152f5c5))

## [1.9.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.8.2...1.9.0) (2021-12-03)


### Features

* added ability to specify alternative config directory (close [#18](https://github.com/valentine195/obsidian-fantasy-calendar/issues/18)) ([7e52db6](https://github.com/valentine195/obsidian-fantasy-calendar/commit/7e52db65091a2812b04239415339505db62d6600))

### [1.8.2](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.8.1...1.8.2) (2021-11-29)


### Bug Fixes

* create event modal behavior improved (close [#16](https://github.com/valentine195/obsidian-fantasy-calendar/issues/16)) ([2593853](https://github.com/valentine195/obsidian-fantasy-calendar/commit/259385310069957bf1f1afa23813d066fa04debe))
* different views with same calendar will sync state (close [#15](https://github.com/valentine195/obsidian-fantasy-calendar/issues/15)) ([ab0f07c](https://github.com/valentine195/obsidian-fantasy-calendar/commit/ab0f07ce6ceaf4c284d1e4190b2b4e5a2a818c91))
* events now correctly displayed when switching months (close [#14](https://github.com/valentine195/obsidian-fantasy-calendar/issues/14)) (close [#15](https://github.com/valentine195/obsidian-fantasy-calendar/issues/15)) ([3f9ed81](https://github.com/valentine195/obsidian-fantasy-calendar/commit/3f9ed815a402a90857b19de66ecd6cfea141b436))
* partial fix for multi-day event sorting ([b953283](https://github.com/valentine195/obsidian-fantasy-calendar/commit/b9532833745743a94aa715698eef8eeb0be0206b))

### [1.8.1](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.8.0...1.8.1) (2021-11-19)


### Bug Fixes

* dot styling ([1a1e649](https://github.com/valentine195/obsidian-fantasy-calendar/commit/1a1e649458f7ca64a4cae600430cb39af675b7fe))

## [1.8.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.7.0...1.8.0) (2021-11-19)


### Features

* added Toggle Moons command ([05da3b5](https://github.com/valentine195/obsidian-fantasy-calendar/commit/05da3b5c9c464f91f1f508017879e864740512f0))


### Bug Fixes

* allow moons to wrap ([9401d4e](https://github.com/valentine195/obsidian-fantasy-calendar/commit/9401d4e0830b20d05e135ad3ca34d8b8bc0d50b9))

## [1.7.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.6.0...1.7.0) (2021-11-19)


### Features

* event dots now auto-detect overflow ([f095d9f](https://github.com/valentine195/obsidian-fantasy-calendar/commit/f095d9f01b4cfa7780fb55a9a9d9ff3adb241639))
* flags now auto-detect overflow (close [#5](https://github.com/valentine195/obsidian-fantasy-calendar/issues/5)) ([6029669](https://github.com/valentine195/obsidian-fantasy-calendar/commit/6029669ed97138182d5592a62a207b2f4a2af36e))


### Bug Fixes

* styling for single-day event flags ([3f4edbb](https://github.com/valentine195/obsidian-fantasy-calendar/commit/3f4edbb481bfb4bf8b0cc8803d0dd58b88cc67d1))

## [1.6.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.5.3...1.6.0) (2021-11-19)


### Features

* new "Add Event" button on day view ([ff5256e](https://github.com/valentine195/obsidian-fantasy-calendar/commit/ff5256eb4de637d3706008f4e65a729d13519f4d))


### Bug Fixes

* "Open Day" view indicator doesn't display on adjacent months (close [#7](https://github.com/valentine195/obsidian-fantasy-calendar/issues/7)) ([a62a7ed](https://github.com/valentine195/obsidian-fantasy-calendar/commit/a62a7ede7e2d0e25e24113d4f201612a2b133440))
* fixed moment import error ([0913bad](https://github.com/valentine195/obsidian-fantasy-calendar/commit/0913bade7fbe3d597abfdec775338371e4d0b7e9))

### [1.5.3](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.5.2...1.5.3) (2021-11-19)


### Bug Fixes

* fixed display issue with the event modal and notes with `.` in the name ([be8b3ba](https://github.com/valentine195/obsidian-fantasy-calendar/commit/be8b3ba9c74f826c9969e5f5a384d04204b0367d))
* increment current day logic should be better ([#8](https://github.com/valentine195/obsidian-fantasy-calendar/issues/8)) ([a322a0e](https://github.com/valentine195/obsidian-fantasy-calendar/commit/a322a0e50cdb9919e03da992ad635faaf2fad81d))

### [1.5.2](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.5.1...1.5.2) (2021-11-08)


### Bug Fixes

* "today" button now opens day view (Fixes [#9](https://github.com/valentine195/obsidian-fantasy-calendar/issues/9)) ([d0af6e6](https://github.com/valentine195/obsidian-fantasy-calendar/commit/d0af6e68147482f8a8aa79336fa7ace18f8eb377))

### [1.5.1](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.5.0...1.5.1) (2021-11-08)

## [1.5.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.4.1...1.5.0) (2021-11-02)


### Features

* added ability to have multi-day intercalary months ([e9b5d87](https://github.com/valentine195/obsidian-fantasy-calendar/commit/e9b5d87988d0c32899a9ca3b0b15561d20cc1105))

### [1.3.2](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.4.0...1.3.2) (2021-11-01)

## [1.4.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.3.1...1.4.0) (2021-11-01)


### Features

* add "Create Note" option to event flag context menu ([2aaa21d](https://github.com/valentine195/obsidian-fantasy-calendar/commit/2aaa21d587d116b6d2575b44ae8dac74b555822c))


### Bug Fixes

* events are now unlinked from note if note is deleted ([b4abe11](https://github.com/valentine195/obsidian-fantasy-calendar/commit/b4abe118e33f4d1091defe6a5250ffe80ec28232))
* Files linked to notes through the modal will now be parsed (close [#6](https://github.com/valentine195/obsidian-fantasy-calendar/issues/6)) ([4d712ff](https://github.com/valentine195/obsidian-fantasy-calendar/commit/4d712ff4de26652d22ed21e2ba833113bc82fbfd))

### [1.3.1](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.3.0...1.3.1) (2021-10-29)


### Bug Fixes

* doubled first month in some situations in year view ([b00b4d9](https://github.com/valentine195/obsidian-fantasy-calendar/commit/b00b4d9ec30eec1a5b6a4817b4fa4fb91a75800a))
* fixed css issue caused by addition of weeks ([0e6c1e4](https://github.com/valentine195/obsidian-fantasy-calendar/commit/0e6c1e42fdb3ded4e6b0eb969c10002a42564788))
* issue with single day length "multi" events ([af6c52c](https://github.com/valentine195/obsidian-fantasy-calendar/commit/af6c52cd74810ceb48757d37640112a677ef2cb9))
* removed console.logs ([89de4a2](https://github.com/valentine195/obsidian-fantasy-calendar/commit/89de4a2c826663088568829f471716a22375f54d))
* single day events can no longer be considered multi ([cc4f352](https://github.com/valentine195/obsidian-fantasy-calendar/commit/cc4f352eac9a5835b7a9dba435924e257b5cf1f7))

## [1.3.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.2.0...1.3.0) (2021-10-29)


### Features

* added week numbers display ([cddb7bf](https://github.com/valentine195/obsidian-fantasy-calendar/commit/cddb7bf3c16b08377c005058a84469960ab9f28b))


### Bug Fixes

* fixed issue with current date not being clamped inside custom years ([1f02d02](https://github.com/valentine195/obsidian-fantasy-calendar/commit/1f02d0274fef10929a43e2e1da87203b9c0cd383))

## [1.2.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.1.3...1.2.0) (2021-10-27)


### Features

* Custom years can now be created and used ([2901625](https://github.com/valentine195/obsidian-fantasy-calendar/commit/2901625f38150e0fd384a7bdffcbdf100b0e2abe))


### Bug Fixes

* edited calendars in settings were maintaing changes even when canceled ([f8bfeac](https://github.com/valentine195/obsidian-fantasy-calendar/commit/f8bfeac8e7f938f37b82a0d324ca1a35e7f147d9))

### [1.1.3](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.1.2...1.1.3) (2021-10-27)


### Bug Fixes

* another issue with preset ids ([26bfa0e](https://github.com/valentine195/obsidian-fantasy-calendar/commit/26bfa0e89a4cec37fee3412fce5d4183d4f04939))

### [1.1.2](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.1.1...1.1.2) (2021-10-27)


### Bug Fixes

* fixed issue with presets maintaining IDs ([5f072a6](https://github.com/valentine195/obsidian-fantasy-calendar/commit/5f072a6699bae297dfa02f0acef6ce5391f4bb90))

### [1.1.1](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.1.0...1.1.1) (2021-10-25)


### Bug Fixes

* fixed event calculations (fix [#2](https://github.com/valentine195/obsidian-fantasy-calendar/issues/2)) ([0ad8c6b](https://github.com/valentine195/obsidian-fantasy-calendar/commit/0ad8c6bfea5668e47ec2e2f5e750c8faa8c4eb9d))
* fixed event creation parsing issue with end dates ([532d6e8](https://github.com/valentine195/obsidian-fantasy-calendar/commit/532d6e84adc9b7fdbbc7b18e731f43ea12ca7bdc))
* removed logs ([ed9f12e](https://github.com/valentine195/obsidian-fantasy-calendar/commit/ed9f12e88c8ee873bc986068f2e18ca3f17bd7b0))

## [1.1.0](https://github.com/valentine195/obsidian-fantasy-calendar/compare/1.0.2...1.1.0) (2021-10-25)


### Features

* Add UTC date as frontmatter option ([8d421f1](https://github.com/valentine195/obsidian-fantasy-calendar/commit/8d421f1e80db57fcd72c8aaa23b9091d03fadd9a))


### Bug Fixes

* removed unused css classes ([32197e6](https://github.com/valentine195/obsidian-fantasy-calendar/commit/32197e6e060ce40c8cf583709017fdce411db036))

## 1.0.0

Plugin released to the community.