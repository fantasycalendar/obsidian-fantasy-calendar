# Fantasy Calendars

Create fantasy calendars in Obsidian!

![](https://raw.githubusercontent.com/valentine195/obsidian-fantasy-calendar/master/assets/example.png)

<table>
<tbody>
<tr>
<td>
<a href="#using-the-plugin">Using the Plugin</a>
</td>
<td>
<a href="#creating-a-calendar">Creating a Calendar</a>
</td>
<td>
<a href="#events-1">Events</a>
</td>
<td>
<a href="#plugin-api">API</a>
</td>
<td>
<a href="#settings">Settings</a>
</td>
</tr>
<tbody>
</table>

## Using the plugin

The plugin will add a calendar view to the right pane on startup. If a calendar view is not in the workspace, one can be added using the "Open Fantasy Calendar" or "Open Large Fantasy Calendar" commands.

> **:pencil: Opening the plugin for the first time?**
>
> The plugin does not come pre-loaded with any calendars. You have to create them yourself!
>
> See [Creating a Calendar](#creating-a-calendar) and [Calendar Presets](#presets) for more info.

> **:calendar: Using the plugin for the real world?**
>
> The plugin's Gregorian Calendar [preset](#presets) is fully accurate!

### Large and small calendars

A large calendar exists in the root workspace, and a small calendar exists in the left or right side pane. There are two distinct commands, but the calendars will detect where they are in Obsidian - as you move them around, they will resize themselves accordingly.

### Current Day

The current day may be changed by right-clicking a day and selecting "Set as Today". Additionally, the current day may be changed for a calendar in the Calendar Settings menu or by editing in the calendar in the plugin settings.

### Calendar Settings

In the top right of a calendar view, there will is a "settings" button that will open a menu with some common settings.

#### Year View

The year view for the calendar may be opened or closed from this menu.

#### Moons

Moons may be displayed or hidden by selecting the option in the menu.

Additionally, there is a "Toggle Moons" command available when a calendar is open.

#### View Day

An arbitrary date can be opened by selecting View Day. Additionally, the current date of the calendar may also be set to this date.

#### Switching Calendars

The plugin will open to the default calendar set in settings. The open calendar for any given view can be switched by selecting "Switch Calendars" from the menu.

### Day View

In the small calendar, right-clicking on a day gives the option to Open Day. This will open a day view pane underneath the viewed month, displaying the state of the moons and any events on that day.

## Creating a Calendar

Calendars can be created and edited in plugin settings.

### Presets

Several common presets are available to apply to the created calendar, including several TTRPG settings and the Gregorian (or "real") calendar.

### Basic Info

#### Name and Description

The calendar name and description can be entered here.

#### Auto-increment Day

The plugin will attempt to increment the current calendar day for every real day that has passed.

#### Current Day

The current day of the calendar is set here.

### Weekdays

New weekdays can be created and managed in this section. Each weekday must be given a name.

#### Overflow Weeks

If off, every month will start on the first weekday. Otherwise, the month will start on the weekday after the previous month's last weekday.

#### First Day

The first day of the first year will occur on this weekday.

### Months

New months can be created and managed in this section. Each month must have a name and a length (days).

#### Intercalary

Months may also be set to intercalary. Intercalary months are a _single day_ that do not fit into an existing month. They do not correspond to a weekday.

### Years

Custom years can be created in this section. Each year must be given a name.

If custom years are created, the calendar will be limited to _only_ the years specified.

### Leap Days

Leap days can be created and managed in this section.

Leap days must be attached to a month and be given a condition.

#### Offset

The leap day conditions will be offset by this many years when calculating - for example, a leap day occuring every 4 years with an offset of 1 will occur on year 1, year 5, year 9...

#### Conditions

Leap day conditions are comprised of three things - the interval, whether or not it is an "exclusive" condition, and whether or not to ignore the leap days offset when calculating.

Exclusive conditions mean the leap day will **not** apply when the condition is met.

A non-exclusive condition following an exclusive condition will override the exclusive condition.

#### Real world example

The leap day for the Gregorian calendar has 3 conditions:

1. Interval 4, non-exclusive, non-offset.
2. Interval 100, exclusive, non-offset.
3. Interval 400, non-exclusive, non-offset.

This leap day will occur every 4 years, but _not_ if the year is divisible by 100, **unless** the year is divisible by 400.

### Intercalary Leap Days

A leap day can be set to intercalary, which means it happens outside the normal flow of the month. The week will be interrupted by the leap day and then continue on the next weekday as if the leap day hadn't happened.

Setting a leap day adds two new settings:

1. Numbered - if set to numbered, the leap day will continue the day numbers as normal.
2. After - the leap day will be added to the month after this day.

### Events

Events can be created and managed in this section.

### Event Categories

Event categories can be created and managed in this section.

### Moons

Moons can be created and managed in this section.

#### Display Moons

If this setting is on, moons will be displayed by default. Moons can always be toggled in the Calendar Settings menu of a view.

#### Moon Creation

Moons require a name, cycle and offset. Additionally, the face and shadow color of the moon graphic may be changed.

##### Cycle

The moon will complete a full rotation every `<cycle>` days.

##### Offset

The start of the moon cycle will be offset by this many days.

## Events

Events can be added to a given day by right-clicking the day and selecting "New Event", or clicking on a day without any events.

Events may also be created by editing the Calendar in plugin settings, or automatically through note frontmatter.

Clicking on an event flag in Day View or in the large calendar will display the event description.

### Categories

Events can be assigned to different categories (created in the calendar in plugin settings). This will cause the dot and the flag to take on the color of the category.

### Event Notes

Events can also link to notes by adding the note in the event creation modal or by automatically creating the event through frontmatter.

When a note is chosen, if the note has the applicable frontmatter (below), the plugin will ask if you wish to use the frontmatter to overwrite the data already entered for the event.

Events linked to notes will open the note when clicked.

### Multi-day Events

Events can span multiple days by selecting "Add End Date" in the event creation modal.

### Event Intervals

You can make an event happen on an interval by clicking the "Add Interval" button. A starting date is required, but an end date is not.

### Event Creation from Frontmatter

The following frontmatter properties are currently supported:

| Property      | Description                                            |
| ------------- | ------------------------------------------------------ |
| `fc-date`     | Date object with `year`, `month` and `day` parameters. |
| `fc-end`      | Date object with `year`, `month` and `day` parameters. |
| `fc-category` | Name of the event category.                            |

If a note with the above frontmatter properties is added to an event, it will prompt you to parse the properties; selecting yes will set the event properties accordingly.

#### Date Object

The date object **must be** in the following format (the parameters can be in any order):

```
---
fc-date:
  year: <number>                                 # Optional. If not provided, event will occur every year.
  month: <name of month> OR <number of month>    # Optional. If not provided, the event will occur every month.
  day: <number>
---
```

### Automatic Event Creation

Additionally, each calendar can automatically create events using frontmatter tags.

Optionally, you can tell the plugin to only watch for new events in a specific folder. Leaving this setting blank will watch the entire vault for new events.

Automatic event creation uses `fc-date` and `fc-category`, as well as an additional property: `fc-calendar`.

| Property                        | Description                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| [`fc-calendar`](#fc-calendar)   | Calendar name or array of calendar names to the event should be added to.                    |
| [`fc-date`](#frontmatter-dates) | Date string, date object or array of date objects with `year`, `month` and `day` parameters. |
| `fc-end`                        | Date string, date object or array of date objects with `year`, `month` and `day` parameters. |
| `fc-category`                   | Name of the event category.                                                                  |

Once this setting is turned on, the calendar will look through its specified folder for events it should add to itself. When it finds them, they will be added - **unless an event with that exact date linked to that note is already on the calendar.**

The calendar will additionally watch for changes to notes and update itself accordingly. **The plugin should never automatically delete an event once created. Once they are added, they must manually be removed.**

#### fc-calendar

The `fc-calendar` field is used to specify **which** calendar the event will be added to.

This field optional, and if not provided alongside an `fc-date`, the plugin will add the event to the **default calendar.**

##### Single Calendar

A note can be registered to a single calendar like so:

```
---
fc-calendar: My Custom Calendar
fc-date: 837-02-28                  # 28th day of the second month of the 837th year.
fc-category: Event Category 1
---
```

##### Multiple Calendars

Additionally, you may specify multiple calendars for an event to be created on, like so:

```md
---
fc-calendar: 
  - My Custom Calendar
  - My Custom Calendar 2
fc-date:                        # Same date for both calendars.
  year: 837          
  month: Custom Month   
  day: 17

**OR**

fc-date:                        # Different dates for each calendar.
  - year: 837                   # Date for My Custom Calendar
    month: Custom Month   
    day: 17
  - year: 92                    # Date for My Custom Calendar 2
    month: Month of Calendar 2   
    day: 3

fc-category: Event Category 1
---
```

The plugin will assign the dates _in the same order the calendars are specified in_.

#### Frontmatter Dates

Frontmatter dates can be supplied two ways - as a date string or as a date object.

Date strings **must** be formatted as specified in settings.

If you need the event to repeat (such as every year or every month), a date object can be supplied instead. The only value that _must_ be supplied for a date object is the day, and the plugin will repeat the event for the unsupplied values. Please note that months may be supplied as the month _name_ or the month _number_ (ie, 2 for February).

```
---
fc-date:        # Event will repeat on the 2nd day of every month of every year.
  day: 3
---

---
fc-date:        # Event will repeat on the 3rd day of the 2nd month of every year.
  day: 3
  month: 2
---

---
fc-date:        # Event will repeat on the 3rd day of every month of the 2021st year.
  day: 3
  year: 2021
---

---
fc-date:        # Event will repeat on the 3rd day of the month of February of the 2021st year.
  day: 3
  month: February
  year: 2021
---

```

Turning on the [Parse Note Titles for Dates](#parse-note-titles-for-dates) will make this field optional, if a date matching the format specified in [the date format](#date-format) setting is in the title.

## Plugin API

The plugin has an API that can be used to get information for the calendars that you have created. This allows you to, for example, easily use data from your calendar in DataviewJS!

The full API can be referenced [here](./src/@types/api.d.ts).

### Accessing the API

The plugin must be retrieved from Obsidian's `App` interface to be used. The easiest way to do that is:

```js
const plugin = app.plugins.getPlugin("fantasy-calendar");
```

This will then allow you to access the Fantasy Calendar API:

```js
const api = plugin.api;
```

## Settings

### Default Calendar

Newly opened views will open to the specified calendar when opened.

### Display Event Previews

Events that link to notes will open a note preview (note: requires the core Page Preview plugin to be enabled).

### Parse Note Titles for Dates

Turn this setting on to allow the plugin to parse note titles for dates for an automatically created event, instead of just looking for `fc-date`.

### Date Format

This setting allows you to override the expected date format for date strings. The default date format is the UTC formatted date, `YYYY-MM-DD`.

Please note that the number of characters provided does not allow you to specify less numbers. The plugin will add the event to the **exact date specified.**

### Folder to Watch

The plugin will only watch the specified folder for automatic event creation. This setting applies to all calendars.

### Default Config Directory

This setting allows you to change the directory the plugin writes its data to.

### Import Calendar

Import a calendar from the wonderful [Fantasy-Calendar](https://app.fantasy-calendar.com) app.

### Calendars

Fantasy calendars can be created and managed here.

## Roadmap

-   [ ] Infinite scrolling in Large Calendar year view
-   [ ] Event creation from notes via drag-n-drop onto day
-   [ ] Event filtering on the calendar

# Installation

## From within Obsidian

The plugin has been submitted to the community plugin store and is awaiting approval.

In the meantime, the plugin may be installed via the [Obsidian BRAT plugin](https://github.com/TfTHacker/obsidian42-brat).

<!-- From Obsidian v0.9.8, you can activate this plugin within Obsidian by doing the following:

-   Open Settings > Third-party plugin
-   Make sure Safe mode is **off**
-   Click Browse community plugins
-   Search for this plugin
-   Click Install
-   Once installed, close the community plugins window and activate the newly installed plugin -->

## From GitHub

-   Download the Latest Release from the Releases section of the GitHub Repository. **This should not be the plugin source. It must be the `main.js`, `manifest.json` and `styles.css` files.**
-   Extract the plugin folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`
    -   Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.
-   Reload Obsidian
-   If prompted about Safe Mode, you can disable safe mode and enable the plugin. Otherwise head to Settings, third-party plugins, make sure safe mode is off and enable the plugin from there.

### Updates

You can follow the same procedure to update the plugin.

# Warning

This plugin comes with no guarantee of stability and bugs may delete data.
Please ensure you have automated backups.

# TTRPG plugins

If you're using Obsidian to run/plan a TTRPG, you may find my other plugin useful:

-   [Obsidian Leaflet](https://github.com/valentine195/obsidian-leaflet-plugin) - Add interactive maps to Obsidian.md notes
-   [Dice Roller](https://github.com/valentine195/obsidian-dice-roller) - Add a little randomness to your notes!
-   [5e Statblocks](https://github.com/valentine195/obsidian-5e-statblocks/) - Create 5e-styled statblocks inside notes
-   [Initiative Tracker](https://github.com/valentine195/obsidian-initiative-tracker) - Track TTRPG Initiative in Obsidian

<a href="https://www.buymeacoffee.com/valentine195"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=valentine195&button_colour=e3e7ef&font_colour=262626&font_family=Inter&outline_colour=262626&coffee_colour=ff0000"></a>
