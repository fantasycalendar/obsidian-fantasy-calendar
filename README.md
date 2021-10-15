# obsidian-fantasy-calendar

Create fantasy calendars in Obsidian!

## Event Creation from Frontmatter

The following frontmatter properties are currently supported:

| Property      | Description                                            |
| ------------- | ------------------------------------------------------ |
| `fc-date`     | Date object with `year`, `month` and `day` parameters. |
| `fc-category` | Name of the event category.                            |

If a note with the above frontmatter properties is added to an event, it will prompt you to parse the properties; selecting yes will set the event properties accordingly.

### Date Object

The date object **must be** in the following format (the parameters can be in any order):

```
---
fc-date:
  year: <number>            # Optional. If not provided, event will occur every year.
  month: <name of month>    # Optional. If not provided, the event will occur every month.
  day: <number>
---
```

### Automatic Event Creation

Additionally, each calendar can automatically create events if the `Automatically Add Events` calendar setting is turned on. This setting is **per calendar.**

Optionally, you can tell the calendar to only watch for new events in a specific folder. Leaving this setting blank will watch the entire vault for new events.

Automatic event creation uses `fc-date` and `fc-category`, as well as an additional property: `fc-calendar`.

| Property      | Description                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| `fc-calendar` | Calendar name or array of calendar names to the event should be added to.       |
| `fc-date`     | Date object or array of date objects with `year`, `month` and `day` parameters. |
| `fc-category` | Name of the event category.                                                     |

Once this setting is turned on, the calendar will look through its specified folder for events it should add to itself. When it finds them, they will be added - **unless an event with that exact date linked to that note is already on the calendar.**

The calendar will additionally watch for changes to notes and update itself accordingly. **Events will never be deleted. Once they are added, they must manually be removed.**

#### Single Calendar

A note can be registered to a single calendar like so:

```
---
fc-calendar: My Custom Calendar
fc-date:
  year: 837
  month: Custom Month
  day: 17
fc-category: Event Category 1
---
```

#### Multiple Calendars

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
