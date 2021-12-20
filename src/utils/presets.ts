import type { Calendar } from "src/@types";

export const PRESET_CALENDARS: Calendar[] = [
    {
        name: "Gregorian Calendar",
        description:
            "A calendar for the real world. Note: May not be 100% accurate.",
        static: {
displayDayNumber:false,
            incrementDay: true,
            displayMoons: true,
            firstWeekDay: 6,
            overflow: true,
            weekdays: [
                {
                    type: "day",
                    name: "Sunday",
                    id: "ID_19ea684b4a08"
                },
                {
                    type: "day",
                    name: "Monday",
                    id: "ID_2928b90ab949"
                },
                {
                    type: "day",
                    name: "Tuesday",
                    id: "ID_0ad9a8f9e95b"
                },
                {
                    type: "day",
                    name: "Wednesday",
                    id: "ID_195a4b290bc9"
                },
                {
                    type: "day",
                    name: "Thursday",
                    id: "ID_abe8c89b0999"
                },
                {
                    type: "day",
                    name: "Friday",
                    id: "ID_2b5b8a79fa4a"
                },
                {
                    type: "day",
                    name: "Saturday",
                    id: "ID_1a78cb79c8cb"
                }
            ],
            months: [
                {
                    name: "January",
                    type: "month",
                    length: 31,
                    id: "ID_e9997a780b3a"
                },
                {
                    name: "February",
                    type: "month",
                    length: 28,
                    id: "ID_b8c9ebeb0b89"
                },
                {
                    name: "March",
                    type: "month",
                    length: 31,
                    id: "ID_b83bda2b9be8"
                },
                {
                    name: "April",
                    type: "month",
                    length: 30,
                    id: "ID_29baea7b28ab"
                },
                {
                    name: "May",
                    type: "month",
                    length: 31,
                    id: "ID_6a3899fad909"
                },
                {
                    name: "June",
                    type: "month",
                    length: 30,
                    id: "ID_384aeb1afa8a"
                },
                {
                    name: "July",
                    type: "month",
                    length: 31,
                    id: "ID_48b8cba87b8a"
                },
                {
                    name: "August",
                    type: "month",
                    length: 31,
                    id: "ID_fa0b1a6bab8a"
                },
                {
                    name: "September",
                    type: "month",
                    length: 30,
                    id: "ID_da880b8af849"
                },
                {
                    name: "October",
                    type: "month",
                    length: 31,
                    id: "ID_babba8186968"
                },
                {
                    name: "November",
                    type: "month",
                    length: 30,
                    id: "ID_da582bfaf9b9"
                },
                {
                    name: "December",
                    type: "month",
                    length: 31,
                    id: "ID_ba1bab4a3a28"
                }
            ],
            moons: [
                {
                    name: "Moon",
                    cycle: 29.530588853,
                    offset: 9.24953,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_a9ab186b1819"
                }
            ],
            leapDays: [
                {
                    name: "Leap Day",
                    type: "leapday",
                    interval: [
                        {
                            ignore: false,
                            exclusive: false,
                            interval: 400
                        },
                        {
                            ignore: false,
                            exclusive: true,
                            interval: 100
                        },
                        {
                            ignore: false,
                            exclusive: false,
                            interval: 4
                        }
                    ],
                    offset: 0,
                    timespan: 1,
                    intercalary: false,
                    id: "ID_b91ad86a887a"
                }
            ],
            eras: [
                {
                    name: "Before Christ",
                    description: "",
                    format: "Year {{abs_year}} - {{era_name}}",
                    start: {
                        year: -1,
                        month: 0,
                        day: 31
                    }
                },
                {
                    name: "Anno Domini",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: 1,
                        month: 0,
                        day: 1
                    }
                }
            ],
            offset: 2
        },
        current: {
            year: null,
            day: null,
            month: null
        },
        events: [
            {
                name: "Summer Solstice",
                description:
                    "At the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.",
                id: "824599",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Winter Solstice",
                description:
                    "The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.",
                id: "824600",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Spring Equinox",
                description:
                    "The equinox marks the day and the night is equally as long.",
                id: "824601",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Autumn Equinox",
                description:
                    "The equinox marks the day and the night is equally as long.",
                id: "824602",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Christmas",
                description:
                    "Christmas is a Christian holiday celebrating the birth of Christ. Due to a combination of marketability and long lasting traditions it is popular even among many non-Christians, especially in countries that have a strong Christian tradition.",
                id: "824603",
                note: null,
                date: {
                    day: 25,
                    year: null,
                    month: 11
                },
                category: "christian-holidays"
            },
            {
                name: "Paschal Full Moon",
                description:
                    "The first full moon after march 21st, which is considered the fixed date for the spring equinox.",
                id: "824604",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "christian-holidays"
            },
            {
                name: "Easter",
                description:
                    "Easter is considered the most important feast for Christians, celebrating the resurrection of Christ. It is classed as a moveable feast occurring on the first full moon after the spring equinox, which is considered to be fixed at March 21st for the sake of computing the date.",
                id: "824605",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "christian-holidays"
            },
            {
                name: "Easter Monday",
                description:
                    "The Monday following the Easter Sunday is often considered part of the Easter Celebration and is a day off in many countries with a strong Christian tradition.",
                id: "824606",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "christian-holidays"
            },
            {
                name: "Good Friday",
                description:
                    "Good Friday is the Friday preceding Easter. It comemmorates the crucifixion of Christ according to the Bible.",
                id: "824607",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "christian-holidays"
            },
            {
                name: "Pentecost",
                description:
                    "Celebrated exactly 50 days after Easter, Pentecost is the celebration of the Holy Spirit appearing before the Apostles as described in the Bible.",
                id: "824608",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "christian-holidays"
            },
            {
                name: "New Year's Day",
                description:
                    "New Year's Day marks the start of a new year on the Gregorian Calendar. It starts when the clock strikes midnight and is often celebrated with fireworks, champagne and kissing.",
                id: "824609",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 0
                },
                category: "secular-holidays"
            },
            {
                name: "Valentine's Day",
                description:
                    "Valentine's day is a celebration of love and romance that is popular across the world. Many more cynically minded people mostly consider it an attempt to monetize the expectation of romantic gestures on the holiday through gift cards, flowers, chocolate and dates.",
                id: "824610",
                note: null,
                date: {
                    day: 14,
                    year: null,
                    month: 1
                },
                category: "secular-holidays"
            },
            {
                name: "Halloween",
                description:
                    'Halloween is holiday popular in the US, Canada and Ireland that has gradually been adopted by more and more countries. It is often celebrated by people dressing up, usually as something scary. Children will often go from door to door shouting "trick or treat" in the hopes of receiving candy, while adults tend to go to parties.',
                id: "824611",
                note: null,
                date: {
                    day: 31,
                    year: null,
                    month: 9
                },
                category: "secular-holidays"
            },
            {
                name: "Work on the first version of this calendar started.",
                description:
                    "Aecius started work on the first version Gregorian Calendar for Fantasy Calendar on this day.",
                id: "824612",
                note: null,
                date: {
                    day: 23,
                    year: 2019,
                    month: 5
                },
                category: "miscellaneous-events"
            },
            {
                name: "Work on this version of the Gregorian Calendar started.",
                description:
                    "On this day, Aecius started to rework the Gregorian Calendar from scratch to make it work with the updates Wasp and Alex implemented since the summer of 2019.",
                id: "824613",
                note: null,
                date: {
                    day: 21,
                    year: 2020,
                    month: 0
                },
                category: "miscellaneous-events"
            },
            {
                name: "Introduction of the Gregorian Calendar",
                description:
                    "On this day in 1582 the Gregorian calendar was officially introduced, following Thursday October 4th on the Julian Calendar",
                id: "824614",
                note: null,
                date: {
                    day: 15,
                    year: 1582,
                    month: 9
                },
                category: "historical-events"
            }
        ],
        id: null,
        categories: [
            {
                name: "Natural Events",
                id: "natural-events",
                color: "#2E7D32"
            },
            {
                name: "Christian Holidays",
                id: "christian-holidays",
                color: "#9b2c2c"
            },
            {
                name: "Secular Holidays",
                id: "secular-holidays",
                color: "#0D47A1"
            },
            {
                name: "Historical Events",
                id: "historical-events",
                color: "#455A64"
            },
            {
                name: "Miscellaneous Events",
                id: "miscellaneous-events",
                color: "#0288D1"
            }
        ]
    },
    {
        name: "Calendar of Greyhawk",
        description: "Calendar of the world of Greyhawk.",
        static: {
displayDayNumber:false,
            incrementDay: false,
            displayMoons: true,
            firstWeekDay: 0,
            overflow: false,
            weekdays: [
                {
                    type: "day",
                    name: "Starday",
                    id: "ID_a8e979984938"
                },
                {
                    type: "day",
                    name: "Sunday",
                    id: "ID_1b68bb78ca1b"
                },
                {
                    type: "day",
                    name: "Moonday",
                    id: "ID_c8b86aea0998"
                },
                {
                    type: "day",
                    name: "Godsday",
                    id: "ID_b8097a18e95b"
                },
                {
                    type: "day",
                    name: "Waterday",
                    id: "ID_1918c99949ca"
                },
                {
                    type: "day",
                    name: "Earthday",
                    id: "ID_fa295a1bab89"
                },
                {
                    type: "day",
                    name: "Freeday",
                    id: "ID_6a485ada3ae8"
                }
            ],
            months: [
                {
                    name: "Needfest",
                    type: "month",
                    length: 7,
                    id: "ID_b8a9e9da8a48"
                },
                {
                    name: "Fireseek",
                    type: "month",
                    length: 28,
                    id: "ID_39b90bd8189a"
                },
                {
                    name: "Readying",
                    type: "month",
                    length: 28,
                    id: "ID_48a9081ad839"
                },
                {
                    name: "Coldeven",
                    type: "month",
                    length: 28,
                    id: "ID_5a7b6beadb68"
                },
                {
                    name: "Growfest",
                    type: "month",
                    length: 7,
                    id: "ID_48c8d82b1908"
                },
                {
                    name: "Planting",
                    type: "month",
                    length: 28,
                    id: "ID_081a793a49da"
                },
                {
                    name: "Flocktime",
                    type: "month",
                    length: 28,
                    id: "ID_eb68a89a0a2a"
                },
                {
                    name: "Wealsun",
                    type: "month",
                    length: 28,
                    id: "ID_9b3a098ae908"
                },
                {
                    name: "Richfest",
                    type: "month",
                    length: 7,
                    id: "ID_f99b4b3a08b8"
                },
                {
                    name: "Reaping",
                    type: "month",
                    length: 28,
                    id: "ID_ebe9eb68ea39"
                },
                {
                    name: "Goodmonth",
                    type: "month",
                    length: 28,
                    id: "ID_fb3b6af9895b"
                },
                {
                    name: "Harvester",
                    type: "month",
                    length: 28,
                    id: "ID_395bcb399b8a"
                },
                {
                    name: "Brewfest",
                    type: "month",
                    length: 7,
                    id: "ID_e8b908181afa"
                },
                {
                    name: "Patchwall",
                    type: "month",
                    length: 28,
                    id: "ID_cbda3b399969"
                },
                {
                    name: "Ready'reat",
                    type: "month",
                    length: 28,
                    id: "ID_592a2a690bf8"
                },
                {
                    name: "Sunsebb",
                    type: "month",
                    length: 28,
                    id: "ID_39e8faf8e9b8"
                }
            ],
            moons: [
                {
                    name: "Luna",
                    cycle: 28,
                    offset: 3,
                    faceColor: "#ffffff",
                    shadowColor: "#292b4a",
                    id: "ID_f8997b39b8b8"
                },
                {
                    name: "Celene",
                    cycle: 91,
                    offset: 46,
                    faceColor: "#ffffff",
                    shadowColor: "#292b4a",
                    id: "ID_7afbb9b88be8"
                }
            ],
            leapDays: [],
            eras: [
                {
                    name: "Common Year",
                    description: "",
                    format: "Year {{year}} CY",
                    start: {
                        year: 1,
                        month: 0,
                        day: 1
                    }
                }
            ]
        },
        current: {
            year: 591,
            day: 1,
            month: 0
        },
        events: [
            {
                name: "Winter Solstice",
                description:
                    "The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.",
                id: "824573",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Spring Equinox",
                description:
                    "The 4th of Growfest is the first day of Low Summer in Oerth's Calendar. This is the point where the sun crosses Oerth's equator. Holidays celebrated on this date include Saint Cuthbert's Day, the Feast of Edoira, the Spring Feast, and Raxivort's Orgy. This is also the day on which the priests of Tlaloc ritually sacrifice and eat the flesh of human children or babies in their patron's honor. Worshippers of Rillifane Rallathil celebrate the Budding on this day, a joyful celebration of new life celebrated through dance and song in oak groves in the heart of the forest. A ritual hunt of a noble heart is held on this day, after which the venison is eaten in celebration of Rillifane's bounty.\n\nAlso celebrated on this date is the Sanctification of Renewal, a sacred holiday to the followers of Garyx.",
                id: "824574",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Summer Solstice",
                description:
                    "\tAt the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.",
                id: "824575",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Autumn Equinox",
                description:
                    "The 4th of Brewfest is the Autumnal Equinox, when the sun crosses the equator from north to south. This date is the official end of high summer and the beginning of autumn on the Greyhawk Calendar. This date is holy to Wenta and is sometimes regarded as an unofficial holy day of Velnius. Among the xvarts, it also marks the celebration of Raxivort's Orgy. The worshippers of Rillifane Rallathil celebrate the Transformation on this day, a time of dancing and spiritual rebirth marking the beginning of autumn and the promise that spring will come again.",
                id: "824576",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Great Moons Glory",
                description:
                    "The night of Great Moon's Glory on Readying 11th, when Luna is full but Celene is new. It is holy to Celestian, and a time when offerings are left to Atroa to beg her to come early and to Telchur to request that he peacefully leave. Druids of the Old Faith are known to also hold this night as auspicious, but few outside their circles know the details.",
                id: "824577",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Dark Night",
                description:
                    "Dark Night, also called Black Night, Star Night, and the Night of Hopeful Dawn, is observed on Goodmonth 11. It is a holy night for the church of Celestian because the stars are so easy to observe without the light of one of the moons getting in the way.\n\nIt is also a holy night for the church of Rao, who refer to it as the Night of Hopeful Judgment. They believe that Rao chooses this time to separate the sinful from the righteous in the afterworld. There is also a prophecy in the Raoan holy text, the Book of Incarum, that claims that Rao will cleanse the world of evil on this night, sometime in the future.\n\nThe priesthood of Kurell consider it holy, too, calling it Kurell's Night, requiring the faithful to undertake special missions on this night to prove their cleverness and skill. Kurell smiles particularly on acts of theft or vengeance performed on his holy night, blessing those who do so successfully. Donations to Kurell's church are encouraged afterwards, for Kurell may take vengeance against those who do not properly thank him for his aid.\n\nMost other people regard Dark Night as a time of ill omen, fearing it as much as the night of the Blood Moon Festival. Bonfires are burned from dusk till dawn, particularly in small villages and in Elmshire and Narwell. Orc and goblin religions view it as an excellent night for raiding settlements. Certain evil cults perform kidnappings, murders, and vile rites during this period. On the other hand, lycanthropic activity is at its lowest.\n\nIggwilv and Tuerny attempted to summon a demonic army to Luna on this night in 585 CY.",
                id: "824578",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Agelong",
                description:
                    "Agelong, observed on the 4th of Richfest (the Summer Solstice), is the celebration of the legendary creation of the elves. According to myth, after Corellon Larethian spilled his blood during the battle with Gruumsh, the rest of the Seldarine gathered this sacred blood and mingled it with the tears shed during the same battle by Sehanine Moonbow. The Seldarine then infused these divine fluids into vessels they had created to be the bodies of the elven race.\n\nThis day is, among the elves, mostly an excuse to go orc-hunting. Elven warriors cut themselves with daggers carved from volcanic glass to remind themselves of Corellon's own wound from Gruumsh's spear, then strive to slaughter as many orcs as possible during the night.",
                id: "824579",
                note: null,
                date: {
                    day: 4,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "Blood Moon Festival",
                description:
                    "The Blood Moon Festival is celebrated on Coldeven 11, the night when Luna is full just before the Spring Equinox. On this night, curses are said to be twice as powerful and the forces of evil are at their strongest. Fiends roam the lands, and human sacrifice is common. This night is held especially sacred by cultists of Nerull, but worshipers of Kurell also mark this night as especially auspicious for acts of vengeance. Goodly folk superstitiously guard their homes with horseshoes, holy water, bottles of milk, and iron filings.\n\nDemonic forces sent by Iuz destroyed the leadership of the Horned Society during the Blood Moon Festival of 583 CY.\n\nIt's possible that this is also the night the elves celebrate as Faerieluck.",
                id: "824580",
                note: null,
                date: {
                    day: 11,
                    year: null,
                    month: 3
                },
                category: null
            },
            {
                name: "Breadgiving Day",
                description:
                    "Celebrated on on the Winter Solstice (Needfest 4), Breadgiving Day, is a day of charity observed in the Free City of Greyhawk by the faiths of Pelor, Rao, and Saint Cuthbert.\n\nThis was not originally a religious holiday as such. It is a new practice that began after the Greyhawk Wars to feed the refugees that flooded the city during that time. Since of Old City who line up by the hundreds along the Processional from the Black Gate. The booths are worked by low-ranking priests from all three religions, with armed priests of St. Cuthbert providing security. A smaller event is held simultaneously below Wharfgate in Greyhawk City's Shacktown.\n\nThe clergies of Heironeous, Pholtus, and Trithereon do not participate, but they compete with one another to perform good deeds the whole week of Needfest. The rivalries between Trithereon and Pholtus, Trithereon and Heironeous, and Pholtus and St. Cuthbert are such that the faiths sometimes fall into arguments and even blows if their \"good deeds\" conflict with each other. Greyhawk's rowdy citizens often cheer and place bets on the outcomes of these quarrels.\n\nThe priests of Pelor hold a morning ceremony on this day with a sermon, singing, and music.",
                id: "824581",
                note: null,
                date: {
                    day: 4,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Brewfest",
                description:
                    "Also called Drunken Days or the Feast of Brewers, Brewfest, the fourth festival week of Oerth's calendar, is a rowdy period unsurprisingly claimed as a holy time by the churches of Olidammara and Wenta. The Free City of Greyhawk does not celebrate the entire week, but Brewfest 1 and Brewfest 7 are both set aside as public holidays. In Elmshire, the week is spent in restful, carefree music, drinking, and dancing. In Hardby it is spent with fistfights, riots, and ensuing hangovers. In Narwell it is celebrated with ale-brewing contests, horse races, beatings, and robbery. In Safeton it is celebrated with nervous violence and nightly orc hunts. The week is also sacred to the Old Faith.\n\nThe elves call this week Fallrite, and use it to contemplate the spirits of their ancestors, the passage to the afterworld, and the fragility of life. They believe other races make merry during Brewfest because they are \"hiding\" to avoid facing death's reality. In contrast, the olvenfolk strive to fulfill the most important of their duties and reach the most crucial of their decisions during this time of year. The elven kings and queens traditionally judge capital cases during Fallrite.",
                id: "824582",
                note: null,
                date: {
                    day: 4,
                    year: null,
                    month: 12
                },
                category: null
            },
            {
                name: "Faerieluck",
                description:
                    "Faerieluck is a holiday celebrated by the elves in early spring, when the power of Faerie runs high and they celebrate with their fey cousins: the sprites, buckawns, pixies, nymphs and so forth. The point of the festival is to remind the elves of their ancient kinship with these creatures. The day is spent playing practical jokes, engaging in battles of wit, and general merriment.",
                id: "824583",
                note: null,
                date: {
                    day: 11,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Feast of Edoira",
                description:
                    "The Feast of Edoira is a holiday celebrated in the Domain of Greyhawk on Growfest 4, during the Spring Equinox. It is named after Edoira, a priest of Rao who centuries ago established the Edoiran Compact, a pact by which many of the lawful good-aligned faiths and people of the Domain could agree to cooperate. The Compact was later extended to non-lawful good and neutral faiths.\n\nEdoira was never deified but was revered by many good faiths in the Domain. The holiday was marked by religious services on Godsday of Growfest led by the clerics of the good faiths who partook of the Compact, and secular festivals by the ordinary citizenry. Observance of the holiday has declined over the years, though the clergies of Rao and Pelor still hold their traditional interfaith services, with occasional participation by the priesthoods of Heironeous and Mayaheine. Since the end of the Greyhawk Wars most of the Domain's outlying communities no longer observe the holiday. Only one church in Safeton still does so.",
                id: "824584",
                note: null,
                date: {
                    day: 4,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Desportium of Magic",
                description:
                    "The highlight of Growfest is the Desportium of Magic. During this day torchlight only, no magic illumination is supposed to be used. Wizards and Sorcerers then perform feats of illusion and magic trying to outdo one another with their displays. Usually there is a panel of judges to decide, in the larger cities there is usually a limit of 5-person teams competing. Each performance during the Desportium of Magic uses a long established theme, that of an attack on the town by various monsters and Dark Elves, repelled by brave warriors and spellcasters. The displays, made up of any number of spells cast without the use of magic devices, cannot actually cause any harm to property or people, but must be as wonderful, striking, detailed, and lifelike as possible.\n\nThis motif is based on actual attacks through the years from the Uttermost War to the most recent Great Slave Raids. The idea is to make the attackers as dreadful as possible and the defenders as heroic as possible, secondary is to make sure that people will always remember the terror of the Uttermost War. In large cities like the CSIO and CSWE and Tarantis, these performances last all night and are amazing to watch. In smaller villages without spellcasters, puppet plays are often done in its stead.",
                id: "824585",
                note: null,
                date: {
                    day: 7,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Holy Day of Pelor",
                description:
                    "The Holy Day of Pelor, also known as Giving Day and Midsummer's Day, is celebrated on the Summer Solstice.\n\nBecause Pelor is widely loved by the commoners, this day is set aside as a day of rest in the Free City of Greyhawk. Only essential work is done on this day. Many merchants close their shops on Giving Day as well out of respect for the Sun Father and his teachings. Gambling houses are closed, but not hostelries, for Giving Day is a day of feasting and goodwill, a time for enjoying the fruits of the Oerth.\n\nPublic services are held from dawn until noon by Pelor's priests, outdoors if the weather permits (which if almost always does, as the clerics use weather-controlling magic for maximum sunlight). Even Greyhawk City's large temple of Pelor is not big enough to hold the throngs who come to celebrate on this day, so throngs of the faithful fill the temple grounds in the Garden Quarter, spilling out from the Millstream to the Nobles' Wall, and to the road leading toward Greyhawk's Grand Theater. Many come, of course, for the free meal the priests provide after the service. The Pelorian priests are well aware of this, but believe that for the needy, a full stomach must come before wisdom and learning. Members of Greyhawk's Guild of Thieves and Beggar's Union, many of whom remember Midsummer's Day fondly from their orphaned childhoods, both protect priests of Pelor on this day, and woe onto those who attempt to test them on this matter.\n\nPriests of Pelor, bedecked in yellow and gold, parade about the streets, demanding donations for their charitable works, freely using guilt to squeeze more from stingy purses. Free healings are given out, particularly to children. Most Greyhawkers wear at least one item of yellow cloth on this day out of respect.\n\nSome crusading Pelorians crusade against evil lycanthropes on this night, since both Celene and Luna are full.",
                id: "824586",
                note: null,
                date: {
                    day: 4,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "Holy Day of Serenity",
                description:
                    "The Holy Day of Serenity, on Reaping 10, is celebrated in Veluna as a holy day of Rao, though it's actually the anniversary of Veluna's secession from Furyondy in 476 CY. It is celebrated with religious singing and worship.",
                id: "824587",
                note: null,
                date: {
                    day: 10,
                    year: null,
                    month: 9
                },
                category: null
            }
        ],
        id: null,
        categories: [
            {
                name: "Natural Events",
                id: "natural-events",
                color: "#2E7D32"
            },
            {
                name: "Religious Holidays",
                id: "religious-holidays",
                color: "#FFEB3B"
            },
            {
                name: "Secular Holidays",
                id: "secular-holidays",
                color: "#0D47A1"
            },
            {
                name: "Magical Events",
                id: "magical-events",
                color: "#311B92"
            },
            {
                name: "Miscellaneous Events",
                id: "miscellaneous-events",
                color: "#0288D1"
            }
        ]
    },
    {
        name: "Calendar of Golarion",
        description: "Calendar for the world of Pathfinder.",
        static: {
displayDayNumber:false,
            firstWeekDay: 0,
            incrementDay: false,
            displayMoons: true,
            overflow: true,
            weekdays: [
                {
                    type: "day",
                    name: "Moonday",
                    id: "ID_db8af8f85b8a"
                },
                {
                    type: "day",
                    name: "Toilday",
                    id: "ID_f87a094b2849"
                },
                {
                    type: "day",
                    name: "Wealday",
                    id: "ID_2a5bb88b3ae8"
                },
                {
                    type: "day",
                    name: "Oathday",
                    id: "ID_c93a0be8981b"
                },
                {
                    type: "day",
                    name: "Fireday",
                    id: "ID_2b7b59794a0b"
                },
                {
                    type: "day",
                    name: "Starday",
                    id: "ID_baaa6a89ca1b"
                },
                {
                    type: "day",
                    name: "Sunday",
                    id: "ID_f9baca088b28"
                }
            ],
            months: [
                {
                    name: "Abadius",
                    type: "month",
                    length: 31,
                    id: "ID_dad9da89f818"
                },
                {
                    name: "Calistril",
                    type: "month",
                    length: 28,
                    id: "ID_980a88cb9b68"
                },
                {
                    name: "Pharast",
                    type: "month",
                    length: 31,
                    id: "ID_a9c96ac80908"
                },
                {
                    name: "Gozran",
                    type: "month",
                    length: 30,
                    id: "ID_a99a697b9abb"
                },
                {
                    name: "Desnus",
                    type: "month",
                    length: 31,
                    id: "ID_8bcad9a8f84a"
                },
                {
                    name: "Sarenith",
                    type: "month",
                    length: 30,
                    id: "ID_484a49a998db"
                },
                {
                    name: "Erastus",
                    type: "month",
                    length: 31,
                    id: "ID_9a48e9b96938"
                },
                {
                    name: "Arodus",
                    type: "month",
                    length: 31,
                    id: "ID_bbe99b2afaea"
                },
                {
                    name: "Rova",
                    type: "month",
                    length: 30,
                    id: "ID_ba39fbe8c8b8"
                },
                {
                    name: "Lamashan",
                    type: "month",
                    length: 31,
                    id: "ID_69d93ba9dba8"
                },
                {
                    name: "Neth",
                    type: "month",
                    length: 30,
                    id: "ID_4ad8fb79eb6a"
                },
                {
                    name: "Kuthona",
                    type: "month",
                    length: 31,
                    id: "ID_9a3a8b388939"
                }
            ],
            moons: [
                {
                    name: "Somal",
                    cycle: 29.5,
                    offset: 9.5,
                    faceColor: "#ffffff",
                    shadowColor: "#292b4a",
                    id: "ID_b87ab959cac9"
                }
            ],
            leapDays: [
                {
                    name: "Leap Day",
                    type: "leapday",
                    interval: [
                        {
                            ignore: false,
                            exclusive: false,
                            interval: 8
                        }
                    ],
                    offset: 0,
                    timespan: 1,
                    intercalary: false,
                    id: "ID_88c8da3b8b2b"
                }
            ],
            eras: [
                {
                    name: "Age of Serpents",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: 4720,
                        month: 8,
                        day: 15
                    }
                },
                {
                    name: "Age of Darkness",
                    description: "",
                    format: "Year {{abs_year}} - {{era_name}}",
                    start: {
                        year: -5300,
                        month: 0,
                        day: 1
                    }
                },
                {
                    name: "Age of Anguish",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: -4500,
                        month: 8,
                        day: 1
                    }
                },
                {
                    name: "Age of Destiny",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: -3500,
                        month: 8,
                        day: 1
                    }
                },
                {
                    name: "Age of Enthronement",
                    description: "",
                    format: "Year {{year}} AR - {{era_name}}",
                    start: {
                        year: 1,
                        month: 8,
                        day: 1
                    }
                },
                {
                    name: "Age of Lost Omens",
                    description: "",
                    format: "Year {{year}} AR - {{era_name}}",
                    start: {
                        year: 4606,
                        month: 8,
                        day: 1
                    }
                }
            ]
        },
        current: {
            year: 4720,
            day: 15,
            month: 0
        },
        events: [
            {
                name: "Summer Solstice",
                description:
                    "At the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.",
                id: "824492",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Winter Solstice",
                description:
                    "The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.",
                id: "824493",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Spring Equinox",
                description:
                    "The equinox marks the day and the night is equally as long.",
                id: "824494",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Autumn Equinox",
                description:
                    "The equinox marks the day and the night is equally as long.",
                id: "824495",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Eternal Kiss",
                description:
                    "Zon-Kuthon\n\nCulminating on the first new moon of the new year, the Eternal Kiss is an 11 day ceremony honoring Zon-Kuthon. On the final day, a living sacrifice is made to the Dark Prince, after the victim is pampered and pleasured for the ten days prior. The sacrifice can either be an enemy or a great devotee of the church, and is kept alive for as long as possible during the torture using magic. This holiday often involves fortune-telling as a part of the torture, using the victim's entrails or their cries of pain to determine the Midnight Lord's will. Occasionally it is believed that the sacrifice will prophesy with the voice of Zon-Kuthon himself.",
                id: "824496",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Longnight",
                description:
                    "Longnight is a holiday celebrated on the full moon in the winter month of Abadius. During the festival, revelers stay up all night to greet the dawn to defy the long winter months. It is even celebrated in Irrisen, where there are no natural seasons.",
                id: "824497",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Foundation Day",
                description:
                    "Absalom, Milani\n\nFoundation Day is a civil holiday celebrated on the New Year (1 Abadius) in Absalom to commemorate the city's founding by the god Aroden in 1 AR.",
                id: "824498",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Pjallarane Day",
                description:
                    "Irrisen\n\nPjallarane Day is an ancient holiday in Irrisen celebrated on 1 Abadius (New Year's Day). Every 100 years, Baba Yaga returns to Golarion to remove her daughter from the throne of Irrisen, and put another daughter on the throne instead. In 3713 AR the third Queen of Irrisen, Pjallarane, and her children chose to resist. Baba Yaga ruthlessly crushed the rebellion in a single day, which is now celebrated as a holiday. The festival includes feasting and the burning of effigies of tar and straw. This is a reminder of the fate of Pjallarane's followers, who were burned alive as a warning to all those who would oppose Baba Yaga.",
                id: "824499",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Vault Day",
                description:
                    "Abadar\n\nVault Day is a holiday held on 6 Abadius in honor of Abadar, Master of the First Vault.",
                id: "824500",
                note: null,
                date: {
                    day: 6,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Ruby Prince's Birthday",
                description:
                    "Osirion\n\nThe Ruby Prince's Birthday is a national holiday in Osirion in honor of the birthday of Khemet III, the Ruby Prince. It is celebrated annually on the 20 Abadius.",
                id: "824501",
                note: null,
                date: {
                    day: 20,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Merrymead",
                description:
                    "Druma, Cayden Cailean\n\nA holiday occurring on 2 Calistril, Merrymead was started in Druma and is supposed to be a time to share of the last of the previous year's mead with the rest of the community.\n\nIn current times, most people just use it as an excuse to drink excessively. The poor travel from bar to bar drinking whatever alcohol they can afford, while the wealthy will set aside specific vintages for this day. A known consequence of this day are 'mead riots' that happen when there are more celebrants than there is alcohol to serve them. This leads to a violent, destructive group of people in a crowded bar. If this is a common occurrence for particular cities, they may reinforce their guard force for the inevitably eventful night.",
                id: "824502",
                note: null,
                date: {
                    day: 2,
                    year: null,
                    month: 1
                },
                category: null
            },
            {
                name: "King Eodred II's Birthday",
                description:
                    "Korvosa\n\nKing Eodred II's Birthday was a local holiday in the Varisian city-state of Korvosa and was celebrated on 16 Calistril. It commemorated the birthday of its former ruler, King Eodred Arabasti II, who decreed that on the day, scantily clad women would dance and serve free wine to celebrants.",
                id: "824503",
                note: null,
                date: {
                    day: 16,
                    year: null,
                    month: 1
                },
                category: null
            },
            {
                name: "Loyalty Day",
                description:
                    "Cheliax, Asmodeus\n\nLoyalty Day is a holiday in the nation of Cheliax commemorating the date on Calistril 19, 4640 AR when House Thrune signed the Treaty of Egorian, declaring it the victor in the Chelish Civil War and ruler of the empire. Because of House Thrune's well-known ties to the infernal, this holiday is also observed by the Church of Asmodeus who consider it a feast day. The church along with local governments provide a free meal to all citizens to remind them of the benefits House Thrune provides them with.",
                id: "824504",
                note: null,
                date: {
                    day: 19,
                    year: null,
                    month: 1
                },
                category: null
            },
            {
                name: "Fateless Day",
                description:
                    "Mahathallah\n\nFollowers of Mahathallah mark each leap day as Fateless Day, when the River of Souls temporarily stops and souls can escape Pharasma's judgment. They perform many sacrificial and suicidal rituals on Fateless Day.",
                id: "824505",
                note: null,
                date: {
                    day: 29,
                    year: null,
                    month: 1
                },
                category: null
            },
            {
                name: "Golemwalk Parade",
                description:
                    "Magnimar, Varisia\n\nThe Golemwalk Parade is a parade of golems created by amateurs hoping to win a monetary grant, or even a job, from the Golemworks in Magnimar. At the end of the parade along the Avenue of Honors, the constructs are judged.",
                id: "824506",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Day of Bones",
                description:
                    "Pharasma\n\nPriests and worshipers of the Lady of Graves parade the bodies of the recently dead on this holiday, holding free burials afterwards.",
                id: "824507",
                note: null,
                date: {
                    day: 5,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Sable Company Founding Day",
                description:
                    "Korvosa\n\nSable Company Founding Day is a holiday marking the founding of the Sable Company of the Varisian city-state of Korvosa. Celebrated on 6 Pharast, the day is marked by somber military parades that generally preclude the consumption of alcohol, a staple on most other holidays.",
                id: "824508",
                note: null,
                date: {
                    day: 6,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Night of Tears",
                description:
                    "Solku\n\nThe Night of Tears held annually on 7 Pharast in the Katapeshi town of Solku. It is a solemn vigil commemorating those lost in the Battle of Red Hail in 4701 AR.",
                id: "824509",
                note: null,
                date: {
                    day: 7,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Kaliashahrim",
                description:
                    "Qadira\n\nKaliashahrim is a national holiday celebrated on Pharast 13 in Qadira that celebrates the Padishah Emperor of distant Katheer, and Qadira's loyalty to him.",
                id: "824510",
                note: null,
                date: {
                    day: 13,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Conquest Day",
                description:
                    "Nex\n\nEvery year, on the 26th of Pharast, Elder Architect Oblosk — oldest member of Nex's Council of Three and Nine — ascends to the highest balconies of the Bandeshar in Quantium. In a voice made thunderous by the platform's magic, the wizened pech councilman spends the hours from dusk to just past noon enumerating the atrocities committed by the necromancers of Geb upon the people of Nex, culminating with the disappearance of the archwizard Nex himself. At the conclusion of this record of national wounds, the country's eleven other council members join Oblosk in renewing their yearly vow to neither forget nor forgive the Gebbites' atrocities and to again swear in their lost ruler's name to endlessly wage war against their ancient enemies.\n\nOn this day, known as Conquest Day, all the people of Nex are expected to share in their leaders' oaths, to celebrate the shared patriotism of their wondrous nation, and to remember the sacrifices of heroes past. This also makes it a day for many Nexian wizards to reveal deadly new spells, gigantic constructs, and audacious arcane masterworks—which many creators promise to be the doom of their foes. Even throughout the rest of the Inner Sea region, many crusaders, rebels, and zealots observe Conquest Day as a day to renew blood oaths, launch long-planned battles, and finally take revenge. It is a day for words of honor, a day for battle cries, and a day where glory most favors the bold.",
                id: "824511",
                note: null,
                date: {
                    day: 26,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Days of Wrath",
                description:
                    "Asmodeus, Cheliax\n\nThe Days of Wrath, or Dies Irae, are a holiday celebrated on both solstices and equinoxes in the nation of Cheliax and wherever Asmodeus is worshiped. They are primarily a national holiday and not truly a religious one, but the two are often confused due to Cheliax's current political climate. Various contests and blood sports are held on these days, promoting those elites who can clearly demonstrate their superiority over others. Some believe that these competitions are watched and judged by devils themselves. In the parts of the world where the Prince of Darkness is not openly venerated, these holidays take on a different tone: they are used to settle old grievances and also to end contracts.\n\nIn these days, bloodsports are organized into cities' stadiums. Slaves and servants of any master may choose to enter the arena for one-on-one bloody battles to the death. Free men and women of all classes are free to enter the arena as well. The entrants fight in rounds until at last one stands alone. The winner is granted freedom from slavery or servitude, erasure of all debts, and a purse of gold.\n\nThe winter solstice sees the culmination of the Dies Irae, with all the winners of the three previous bouts summoned to Egorian to fight to the death for the amusement of the nobles. The winner is given a title of baronet and a plot of land.",
                id: "824512",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Firstbloom",
                description:
                    "Gozreh\n\nFirstbloom is a holiday celebrating the first planting of the agricultural season, and generally associated with the weather god Gozreh. It falls on the vernal equinox. Many farming communities see it as the beginning of the year, even though conventional calendars begin two months earlier. Despite weariness after a full day planting, many farming communities hold celebrations come the night: feasting, dancing and courtship feature showing the cycle of nature.",
                id: "824513",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "First Cut",
                description:
                    "Falcon's Hollow\n\nThe First Cut celebration in Falcon's Hollow used to mark the start of the work in the woods each spring. Now, however, it is a meaningless ramshackle ceremony as Thuldrin Kreed forces the lumber crews to work through even during the coldest months in the winter. Still, First Cut brings people out to celebrate the start of the spring.",
                id: "824514",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Currentseve",
                description:
                    "Gozreh\n\nOn this religious holiday, all who travel on the water make offerings to Gozreh in the hopes of safe passage for the coming year.",
                id: "824515",
                note: null,
                date: {
                    day: 7,
                    year: null,
                    month: 3
                },
                category: null
            },
            {
                name: "Taxfest",
                description:
                    "Abadar\n\nNo one enjoys paying taxes but the collection of fair taxes is considered an integral part of the maintenance of society, and is therefore holy to the god Abadar. Every year on the 15th of Gozran, priests of the church of Abadar spend the day walking city streets, doing what they can to make the bitter pill of annual taxes a bit easier to swallow.\n\nThe Business of the Day\n\nFrom dawn to dusk, clerics of Abadar attend the tax collectors of sizeable communities as the tax wagons roll from door to door. The church officials monitor these activities to make sure that the process is conducted respectfully and justly, and that citizens know that the process is monitored. More than just aiding in the yearly errand, the faithful personally thank every citizen for contributing to the improvement of their city, extol the public works funded by their contributions, and foretell the grandeur of civic projects to come. The disenfranchised and destitute they attempt to comfort as best they can, quoting from their god's dogma on work and worthiness, but this is not a day for discounts or deferrals. The citizens are able to voice their concerns and ideas as to where the monies levied should best be applied. Citizens are free to speak their mind on any issue here without fear of repercussion.\n\nThe Celebrations of the Day\n\nAt dusk, the Abadarans host several celebrations in parks, plazas, and other communal areas about the city, organizing donations and contributions from local vendors to feed and entertain all-comers. Having already preached to most of the city over the course of the day, the clerics perform only a brief opening ceremony, dedicating the feast to Abadar, the city, and its great people. These celebrations are often quite distinct from neighbourhood to neighbourhood and are almost always divided along economic boundaries.\n\nThe festivities involving the wealthiest citizens usually happen on the steps of city hall or other grand civic buildings and feature the best music and food, but often little more than polite card and guessing games. These galas usually wrap up by midnight.\n\nFor the common folk, the parks and marketplaces take on a carnival atmosphere, with simple but good food, local ales, performances by talented citizens, and games of chance going on well into the night. A prevailing superstition through these festivals is that, during the celebration, it is lucky to kiss—or in some regions, pinch—a cleric of Abadar, leading to many a rosy-cheeked cleric.\n\nEven the city's poor are given reason to celebrate, as the local temple of Abadar hosts a cheery but unabashedly religious gathering on its steps, feeding all comers, doling out a hearty ration of wine, singing hymns of the faith, and providing tokens for a second wine ration for any who return to attend a service within the month.\n\nFor a holiday that revolves around paying taxes, this Abadaran festival is not as reviled as one might expect.",
                id: "824516",
                note: null,
                date: {
                    day: 15,
                    year: null,
                    month: 3
                },
                category: null
            },
            {
                name: "Wrights of Augustana",
                description:
                    "Andoran, Brigh\n\nThis local festival in the Andoran port city of Augustana is held to honor and celebrate the local shipbuilding industry as well as the navy. The mathematics and engineering required for the building of the ships is praised by Brigh's faithful.",
                id: "824517",
                note: null,
                date: {
                    day: 16,
                    year: null,
                    month: 3
                },
                category: null
            },
            {
                name: "Gala of Sails",
                description:
                    "Absalom\n\nOne of two local festivals where kite-battlers compete.",
                id: "824518",
                note: null,
                date: {
                    day: 27,
                    year: null,
                    month: 3
                },
                category: null
            },
            {
                name: "Remembrance Moon",
                description:
                    "Iomedae, Lastwall, Ustalav\n\nA national holiday to commemorate those who died in the Shining Crusade against the Whispering Tyrant. Although not strictly a religious holiday, Iomedae's name is heavily invoked, due to her many military accomplishments during the war.",
                id: "824519",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Angel Day",
                description:
                    "Magnimar, Varisia\n\nAngel Day is a local Magnimarian holiday celebrated on 31 Desnus. The annual celebration marks the founding of the city, and its founders' flight from Korvosa. It also honors the presence and popular worship of the empyreal lords, which predates the city by centuries. During the festival, nearly all local businesses shut their doors and the citizens take part in countless feasts, masquerade balls dressed as angels, and the burning of devil effigies meant to symbolize infernally-influenced Korvosa.",
                id: "824520",
                note: null,
                date: {
                    day: 31,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Old-Mage Day",
                description:
                    "Holiday celebrating Old-Mage Jatembe, the father of Garundi magic.",
                id: "824521",
                note: null,
                date: {
                    day: 13,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Multiple Events",
                description:
                    "Festival of the Ruling Sun\n\nShizuru\n\nCelebrates the longest day.\n\nFounder's FollyUlar Kel\n\nAdventurers and children follow a hallucinatory red stripe along zigzagging paths, amusing residents.\n\nHarvest Bounty Festival\n\nSegada\n\nMarking the beginning of the harvest season, this festival involves sporting tournaments, dancing, storytelling, and feasts. Celebrants give thanks and eliminate grudges.\n\nLongwalk\n\nGrandmother Spider, Nurvatchta; southern hemisphere winter solstice\n\nCelebrates the escape of Nurvatchta's anadi people from bondage, in part thanks to Grandmother Spider lengthening their cover of darkness in their escape.\n\nRitual of Stardust\n\nDesna\n\nFestival held in the evening and through the night, where Desna's faithful sing songs and throw sand and powdered gems into bonfires.\n\nRunefeast\n\nMagrim\n\nDay marking the day dwarves learnt the first runes and the proper way to pray.\n\nSunwrought FestivalSarenrae, Brigh\n\nDay commemorating the defeat of Rovagug by Sarenrae, celebrated with the flying of kites, fireworks, and gift giving.",
                id: "824522",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Burning Blades",
                description:
                    "Sarenrae\n\nThe holy, month-long festival ends on this day, featuring dances with flaming blades.",
                id: "824523",
                note: null,
                date: {
                    day: 10,
                    year: null,
                    month: 5
                },
                category: null
            },
            {
                name: "Liberty Day",
                description:
                    "Andoran, Milani\n\nHoliday celebrating Andoran's independence. Milanites celebrate that very little violence occurred.",
                id: "824524",
                note: null,
                date: {
                    day: 3,
                    year: null,
                    month: 5
                },
                category: null
            },
            {
                name: "Talon Tag",
                description:
                    "Andoran\n\nThe Eagle Knights perform aerial displays in Almas on this day.",
                id: "824525",
                note: null,
                date: {
                    day: 21,
                    year: null,
                    month: 5
                },
                category: null
            },
            {
                name: "Riverwind Festival",
                description:
                    "Korvosa\n\nAn early summer holiday that honors a cooling shift in the winds, celebrated with much drinking.",
                id: "824526",
                note: null,
                date: {
                    day: 22,
                    year: null,
                    month: 5
                },
                category: null
            },
            {
                name: "Inheritor's Ascendance ",
                description:
                    "Iomedae\n\nInheritor's Ascendance, originally called 'Herald's Day', honours the day that Iomedae was chosen by the god Aroden to become his herald (thus replacing Arazni), thus boosting her power beyond that of a fledgling goddess. This holiday was renamed after the demise of Aroden.",
                id: "824527",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 7
                },
                category: null
            },
            {
                name: "First Crusader Day",
                description:
                    "Mendev\n\nHoliday in celebration of the continuing crusade against the demons of the Worldwound.",
                id: "824528",
                note: null,
                date: {
                    day: 6,
                    year: null,
                    month: 7
                },
                category: null
            },
            {
                name: "Day of Silenced Whispers",
                description:
                    "Ustalav\n\nThe Day of Silenced Whispers is an Ustalavic holiday celebrated every 9 Arodus marking the defeat of the Whispering Tyrant in 3827 AR by the coalition forces of the Shining Crusade and the liberation of the country after centuries of undead domination.",
                id: "824529",
                note: null,
                date: {
                    day: 9,
                    year: null,
                    month: 7
                },
                category: null
            },
            {
                name: "Founding Day",
                description:
                    "Ilsurian, Varisia\n\nFestival celebrating the founding by Ilsur of the town of Ilsurian in 4631 AR.",
                id: "824530",
                note: null,
                date: {
                    day: 10,
                    year: null,
                    month: 7
                },
                category: null
            },
            {
                name: "Armasse",
                description:
                    "Aroden, Iomedae, Milani\n\nThe raucous, week-long festival known as Armasse is held each year beginning on 16 Arodus. The celebration — once dedicated to the god Aroden — is still important to the faithful of Iomedae, who use it to train commoners in combat, ordain apprentice clergy, pick squires for knights, and teach military history, hoping to prevent the mistakes of the past from being repeated. Among those not dedicated to the Inheritor the holiday has lost most of its religious significance since Aroden's death, tending now only toward wild partying, a fact that has precluded the diabolist authorities of Cheliax from prohibiting Armasse outright. Nevertheless, in places where the church of Asmodeus is openly allowed, it hosts special activities for its parishioners during the same week in an effort to counter the influence of the holiday. The city of Corentyn is especially known for its extravagant Armasse festivities.",
                id: "824531",
                note: null,
                date: {
                    day: 16,
                    year: null,
                    month: 7
                },
                category: null
            },
            {
                name: "Saint Alika's Birthday",
                description:
                    "Korvosa\n\nQuiet holiday honoring the birth of Saint Alika the Martyr.",
                id: "824532",
                note: null,
                date: {
                    day: 31,
                    year: null,
                    month: 7
                },
                category: null
            },
            {
                name: "Archerfeast",
                description:
                    "Erastil\n\nArcher's Day or Archerfeast is a holiday of the god Erastil held annually on the 3rd of Erastus. Despite the holiday's origins in the worship of Erastil, common country folk from the Lands of the Linnorm Kings to Taldor celebrate the height of summer with a day set aside for establishing new relationships, enjoying current camaraderie, and celebrating the gifts of the gods. Archery competitions are held frequently in which the men test their skill with the bow through progressively harder trials. The exact form of competition is different from place to place, and the winner is awarded a rack of elk horns and a quiver of blessed arrows. He is also given the title of \"Protector\", which he holds until the next year.\n\nWhile the festival's traditions emphasize contests of marksmanship, most have expanded to exhibit talents of all types, from baking and storytelling to racing and mock combat. Aside from encouraging a fair-like atmosphere, many of the displays and competitions serve one of two secondary purposes: either as a way for merchants to show off their superior livestock and wares, or (more popularly) as a way for eligible men and women to show off to each other.\n\nWhile the day's events at most Archerfeast fairs are filled with games, food, and crafts, the night brings dancing, drinking, pranks, and the crowning of the princes and princesses of spring and summer for the two single youths and two single adults who fared best in the day's events. The festivities continue late into the evening, but end promptly at midnight, so that in true Erastilian fashion the next day's responsibilities are not overly impeded. For those not of Erastil's flock, however, private parties, drinking, and trysting carry on long into the next morning.",
                id: "824533",
                note: null,
                date: {
                    day: 3,
                    year: null,
                    month: 6
                },
                category: null
            },
            {
                name: "Founding Festival",
                description:
                    "Korvosa\n\nFounding Festival is a local Korvosan celebration marking the establishment of the city in 4407 AR. Held annually on 14 Erastus, the festival is a chance for the citizens to let off some steam, drink copiously, and watch magical light shows late into the night.",
                id: "824534",
                note: null,
                date: {
                    day: 14,
                    year: null,
                    month: 6
                },
                category: null
            },
            {
                name: "Burning Night",
                description:
                    "Razmiran\n\nItems or people who have transgressed against the god-king of Razmiran are burned on this day.",
                id: "824535",
                note: null,
                date: {
                    day: 17,
                    year: null,
                    month: 6
                },
                category: null
            },
            {
                name: "Kianidi Festival",
                description:
                    "Garundi\n\nThe Kianidi Festival is a week long event held annually between 15 and 21 Erastus by Garundi people everywhere. The Garundi have a powerful belief in belonging to a specific location in this world, with clans or tribes sometimes traveling for years in search of their true home. In these travels each individual will collect small mementos of the places she or he has visited in order to remember them and maintain a spiritual connection. During the Kianidi, a tribe will gather and display these mementos to the group. The best ones are chosen and made part of the clan or tribal history, something which Garundi feel is a great honor.",
                id: "824536",
                note: null,
                date: {
                    day: 15,
                    year: null,
                    month: 6
                },
                category: null
            },
            {
                name: "Harvest Moon",
                description: null,
                id: "824537",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "Multiple Events",
                description:
                    "Festival of Night's Return\n\nNidal\n\nCelebrated throughout Nidal, this holiday involves the burning of effigies and self-flagellation.\n\nSwallowtail Festival\n\nDesna\n\nHoliday celebrated with storytelling, feasting, and the release of butterflies.\n\nWaning Light Festival\n\nSegada\n\nAlso called Blessing of the Sun and Night of Spirits, participants bid farewell to the long days of sunshine with feasting, dancing, and music.",
                id: "824538",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Signing Day",
                description:
                    "Andoran, Cheliax, Galt, Isger\n\nSigning Day is a Chelish holiday, dating back to the height of the empire. Observed on the second Oathday of Rova, this is the day on which new laws in the empire took effect. The significance of this day expanded over many years until imperial marriages, significant business arrangements and oaths of fealty were all conducted on this day.\n\nOriginally, the holiday began as a celebration of the mutual-defense pact between Cheliax, Isger, Galt and Andoran when the united nations threw off the shackles of Taldor, declaring themselves independent from the empire. Observances of the holiday vary, but often include firework displays, feats of strength, and public debates to showcase speaking and rhetorical skills.\n\nAs Cheliax degenerated to civil war and diabolism after 4606 AR, blood pacts and infernal contracts also began to be signed on this day. As a result of Cheliax's new affiliation, Andoran and Galt began to distance themselves from Cheliax and the original interpretation of the holiday. In Andoran it continues to be the day that most national laws take effect as well as being a traditional day of marriage, and the date on which new Steel Falcons are inducted.",
                id: "824539",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "Crabfest",
                description:
                    "Korvosa\n\nCrabfest is a Korvosan holiday held on the first Wealday of Rova. It celebrates the return of the crabs from the cooler waters of the Jeggare River to their winter habitat in Conqueror's Bay, and is marked by crab boil feasts held throughout the city and its surrounding communities.",
                id: "824540",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "Feast of Szurpade",
                description:
                    'Irrisen\n\nThis "celebration of plenty" festival mocks the traditional harvest festivals celebrated in the region before Baba Yaga and her eternal winter descended upon the land.',
                id: "824541",
                note: null,
                date: {
                    day: 26,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "Day of Sundering",
                description:
                    "Ydersius\n\nOnce many holidays were celebrated by the faith of Ydersius, but today only this date has much significance.",
                id: "824542",
                note: null,
                date: {
                    day: 29,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "Admani Upastuti",
                description:
                    "Jalmeri\n\nAdmani Upastuti is a Jalmeri holiday celebrated on the first full moon of Lamashan that marks the founding of Jalmeray as a Vudran colony.",
                id: "824543",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Ascendance Day",
                description:
                    "Iomedae\n\nAscendance Day is an Iomedaean holiday, held on the 6th of Lamashan. The day marks the anniversary of the day Iomedae took the Test of the Starstone in the autumn of 3832 AR and ascended to godhood.\n\nCelebration\n\nThe day is a joyous celebration for the faithful, with singing, pledging of friendships, and forgiving of old grudges.\n\nTo many, the Test of the Starstone represents the greatest of all challenges, yet for Iomedae it was one of three storied promotions in her rise from Aroden's herald to a goddess in her own right. On the 6th of Lamashan, the Inheritor's faithful observe the heroism of Iomedae's life before her moment of ascension and celebrate the anniversary of the apotheosis itself.\n\nThe celebration takes place in several stages. Early in the day, troupes of performers—as often passionate amateurs as professionals—stage morality plays featuring the Eleven Acts of Iomedae, the heroic near-miracles and sacrifices she made leading up to her trials in the Starstone Cathedral. Scripts vary by region, city, and even neighborhood, but despite differences in setting, performance medium, and word choice, the themes and morals are all the same.\n\nAs the day continues, the priests organize jousts and mock battles, allowing anyone to participate so long as she can demonstrate enough skill to not be a risk to herself or others. The winners of these contests then face tests of mental acuity such as solving riddles, deciphering philosophical quandaries, and answering questions of honor and justice. Those who prove themselves in both contests are awarded a white cloak—representing the Inheritor at peace—styled after Iomedae's own red garment to wear for the rest of the celebration. Feasting and singing follow the competitions, mirroring the jubilation that followed Iomedae's ascension. This is occasion for making pledges of friendship and forgiving enemies, and priests circulate about the crowd offering the Inheritor's blessing to those who do and providing a moment's counsel or mediation for those who need an extra nudge.\n\nThe celebration typically ends before midnight, and the following day the priests and previous day's champions gather up the blunted swords from the mock battles, sharpen them, and distribute them among the church's armory and those of like-minded organizations so that all may remain vigilant against evil and prepared to strike it down.",
                id: "824544",
                note: null,
                date: {
                    day: 6,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Bastion Day",
                description:
                    "Solku\n\nBastion Day is a two-day festival held annually on 19 and 20 Lamashan in the Katapeshi town of Solku honoring the founding of the town, when it is traditional to host a stranger from one noon until the next.",
                id: "824545",
                note: null,
                date: {
                    day: 19,
                    year: 4712,
                    month: 9
                },
                category: null
            },
            {
                name: "Jestercap",
                description:
                    "Andoran, Druma, Taldor\n\nJestercap occurs at the end of the month of Lamashan, traditionally on the 27th (although a few regions have taken to moving the exact day around slightly so it always falls on the last Starday of the month, allowing people who wish to celebrate in excess to have the following day of rest to recover).\n\nHistory\n\nWhile Jestercap has been embraced with excited open arms by the gnome communities of the Inner Sea region, its original genesis is said to have been in one of Taldor's coastal cities not long after King Aspex the Even-Tongued broke from the nation, significantly weakening Taldor's power and beginning that nation's long decline. The holiday was originally intended to distract the distraught Taldan populace with a night of revelry and comedic entertainment, but the antics of jesters were simply not enough.\n\nOver the course of the first few years, Jestercap evolved from a holiday of observation to a holiday of participation. Today, the holiday is a time where anyone can pull pranks or jokes or japes on companions, on neighbors, and (most typically) on rivals, with the understanding that provided no lasting harm is done, any humiliations inflicted before midnight are to be taken in stride. Of course, come morning the day after, there are inevitably jokes that went too far, and grudges and feuds borne from Jestercap antics have a way of lingering for months to follow.\n\nIn Religion\n\nFollowers of Chaldira Zuzaristan, a halfling deity of mischief, treat Jestercap as a holy day and their pranks — often elaborate and extravagant in nature and plotted for months in advance — as displays of their faith.",
                id: "824546",
                note: null,
                date: {
                    day: 27,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Feast of the Survivors",
                description:
                    "Zon-Kuthon, Nidal\n\nA harvest festival signifying the centuries of Nidalese ancestors protected by Zon-Kuthon. The ceremonial tables are made of human bones of community members from past generations.",
                id: "824547",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Kraken Carnival",
                description:
                    "Absalom\n\nThe second of two local festivals where kite-battlers compete.",
                id: "824548",
                note: null,
                date: {
                    day: 15,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Independence Day",
                description:
                    "Galt\n\nMarks the beginning of the Red Revolution.",
                id: "824549",
                note: null,
                date: {
                    day: 5,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Seven Veils",
                description:
                    "Sivanah\n\nThe holiday known as Seven Veils, which takes place on the 23rd of Neth in most realms of the Inner Sea region, is a celebration of the region's diversity — a time when social boundaries break down even further in a day-long event filled with dancing, feasting, and courting. The evening traditionally closes out with the Seven Veil masquerade, a ball wherein the participants wear disguises that hide their race or gender (often using minor magical trinkets and spells) or disguise these features as entirely new characteristics. At the end of the ball, the participants remove their disguises to their partners, often with unpredictable and sometimes delightfully awkward results. Traditionalists and conservative minds often find the Seven Veils masquerades to be scandalous or off-putting, yet they remain particularly popular in most of the larger cities of the land.\n\nHistorians note that the original \"Dance of the Seven Veils\" has a much different genesis than one promoting diversity — the mysterious cult of Sivanah, goddess of illusions, mystery, and reflections, is generally cited as the source of this festival, and indeed, worshippers of the goddess (herself known as the Seventh Veil) count the 23rd of Neth as one of their most sacred of days. What rituals the church of Sivanah performs on this date, however, are unknown to outsiders, for the cult enjoys its secrets. This secrecy has, unsurprisingly, given rise to all manner of sinister rumour, yet when Seven Veils rolls around each year, its eager participants are quick to set aside rumour in preference for the night's fun and games.",
                id: "824550",
                note: null,
                date: {
                    day: 23,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Abjurant Day",
                description:
                    "Nethys\n\nAbjurant Day occurs on 8 Neth and is known as a day of cooperation between neighbors to shore up mutual defenses and train allies in magic. Potential apprentices are often tested on the day.",
                id: "824551",
                note: null,
                date: {
                    day: 8,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Great Fire Remembrance",
                description:
                    "Korvosa\n\nGreat Fire Remembrance is a holiday celebrated on each 13 Neth in the Varisian city of Korvosa. It commemorates the Great Fire of 4429 AR, which devastated the then still fledgling Chelish colony of Fort Korvosa. On this somber day, most of the city shuts down and people generally remain at home. It has become tradition not to light any fires (not even cooking fires) on Great Fire Remembrance.",
                id: "824552",
                note: null,
                date: {
                    day: 13,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Even-Tongued Day",
                description:
                    "Cheliax, Asmodeus, Milani\n\nObserved on 14 of Neth, Even-Tongued Day was once a day of joy and celebration in Cheliax, but has become instead one of mourning.\n\nOriginally, the date marked the conquest of Aspex the Even-Tongued, who brought the nations of Galt, Andoran and Isger under Chelish control. Since the death of Aroden and the loss of these nations, the holiday instead marks the loss of territory and glory once held by Cheliax. Oaths are sometimes made, typically to Asmodeus, and rarely of a pleasant nature (such as the reclaiming of the lost empire and vengeance against treacherous former allies).\n\nCitizens wear black on this day, public speaking is forbidden, and old feuds and vendettas are rekindled.",
                id: "824553",
                note: null,
                date: {
                    day: 14,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Evoking Day",
                description:
                    "Nethys\n\nA holy day to followers of Nethys, Evoking Day is full of vibrant explosions, skillful wielding of spells, and much dancing. Evoking Day is observed on the 18th of Neth, and while this holiday is mostly celebrated in Garund, temples dedicated to Nethys host celebrations throughout the Inner Sea region. Traditional celebrations of Evoking Day have changed over the thousands of years since its first incarnation, but to this day every occurrence of Evoking Day still features a grand meal shared by celebrants during the afternoon and a wondrous exhibition of brilliant and explosive magic once the sun sets. These days, such colorful magical displays are augmented with fireworks of a dozen different colors and patterns.\n\nIn temples of Nethys dedicated to revering evocation magic, priests and prominent arcanists participate in spell duels where each contestant stands on a raised platform and takes turns trying to incapacitate her opponent. The magic wielded in theses duels favors the flashy over the dangerous, but clerics of Nethys are on hand to treat any injuries. These duels gather large crowds eager to lend their applause to their favorite contestant.\n\nIt is also during this festival when wizards who worship Nethys open their spellbooks to others who share their craft. Wizards normally guard their spellbooks with their lives and covet the eldritch information therein, but on Evoking Day these wizards meet with one another prior to the afternoon feast to share their spells just as they prepare to share a grand meal.\n\nThough Evoking Day is primarily a day of grand magic, those with no spellcasting talent still flock to local temples of Nethys to partake in the shared feast and flashy evening displays of magic and fireworks. Between the meal and into the night, celebrants wear black-and-white robes and perform joyous dances meant to give thanks to the wonders Nethys brought to humankind. These dances are grand affairs involving dozens of dancers all spinning and clapping to the accompanying music as their black-and-white robes fan out around them with each spin. As night descends and the fireworks and magical displays begin, the dancing rises to a climax erupting in shouts and calls to Nethys with each thunderous boom.",
                id: "824554",
                note: null,
                date: {
                    day: 18,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Baptism of Ice",
                description:
                    "Irrisen\n\nIn the Irriseni Baptism of Ice, an annual fertility festival held from the 24th to the 30th of Neth, locals parade all children born during the year through the town in fine clothes. In most towns, the festival ends with a symbolic sacrifice of a child to the cold. However, in Whitethrone and Irrisen's provincial capitals, a peasant child is killed through exposure.",
                id: "824555",
                note: null,
                date: {
                    day: 24,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Transmutatum",
                description:
                    "Nethys\n\nTransmutatum is one of the three major holidays of the church of Nethys, on 28th of Neth. It is a day of reflection and self-improvement. Many followers of Nethys begin research and crafting projects on this day.",
                id: "824556",
                note: null,
                date: {
                    day: 28,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Winter Week",
                description:
                    "Traditional feast; time for courting and spending time with friends.",
                id: "824557",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "The Shadowchaining",
                description:
                    "Zon-Kuthon, Nidal\n\nCommemorating the Midnight Lord's gift of shadow animals.",
                id: "824558",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Pseudodragon Festival",
                description:
                    "Korvosa\n\nKorvosa's Pseudodragon Festival, a holiday celebrated annually on 7 Kuthona, marks the winter migration of wild pseudodragons from the Mindspin Mountains to Conqueror's Bay, which inspires the creatures already in the city—even those domesticated—to play with their wild kin in the skies over the city. Locals mark the day with a joyous inebriation.",
                id: "824559",
                note: null,
                date: {
                    day: 7,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Ascension Day",
                description:
                    "Cayden Cailean\n\nMuch like the god to whom it is dedicated, the Caydenite holiday of Ascension Day is generally celebrated in a very informal style. Occurring annually on 11 Kuthona, it commemorates the day Cayden Cailean passed the Test of the Starstone and ascended to godhood in 2765 AR. In all likelihood, the 11th of Kuthona is not the exact date on which it actually happened, but since the god was dead drunk when it happened, it will probably be never known.",
                id: "824560",
                note: null,
                date: {
                    day: 11,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Winterbloom",
                description:
                    "Naderi\n\nHoliday celebrating Naderi's ascension. Celebrations are typically understated but include readings of The Lay of Arden and Lysena.",
                id: "824561",
                note: null,
                date: {
                    day: 15,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Final Day",
                description:
                    "Groetus\n\nCultists of Groetus perform an hour's silence at dusk on the last day of the year and seek guidance from their god about the End Time.",
                id: "824562",
                note: null,
                date: {
                    day: 31,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Night of the Pale",
                description:
                    "Not all of Golarion's holidays and festivals are times of rejoicing and delight. Holidays worshiped by dark and sinister cults and religions tend to be hidden affairs, their rituals and ceremonies involving cruelties and vile practices that send shivers of fear through gentler society. Scholars suspect that the Night of the Pale—a holiday that traditionally takes place on the last day of the year, the 31st of Kuthona—has links to several sinister religions, but today no one church has specific association with the event. Nonetheless, the Night of the Pale is an event that many look forward to all year, whether in fear or excitement.\n\nOn the Night of the Pale, it is said that the ghosts of those who died during the previous year manifest upon the world and come to visit the homes they lived in during life. Although some might think that the chance of seeing even the shade of a dearly departed one might be a blessing, the Night of the Pale is not a time for tearful reunions, for these ghosts, tradition says, do not return out of love for those they left behind but out of darker compulsions. Lingering jealousy, unfinished arguments, or the simmering need for revenge are said to be what compels the dead to return to torment the living on the Night of the Pale.\n\nThe evening of this night in many communities is celebrated by a morbid feast, the food prepared with themes revolving around graveyards, the dead, and other spooky traditions. This feast, on one level, helps the celebrants to make light of their fears while sharing good company with similarly nervous neighbors, but at another level is believed to placate vengeful spirits as toasts are raised to the memories of the recently departed. These feasts include retellings of favorite memories of the departed, in hopes of reminding the approaching ghosts of brighter and kinder memories than those that compel them to return. The feast always ends at least an hour before midnight in order to give participants time to return home, decorate doors and windows with salt and other trinkets taken from the feasting table (salted bread baked into crook-like shapes are a favorite, as these can be hung from doorknobs and eaves) to ward off evil spirits, and hide in their bedrooms until dawn. Brave youths and adventurers often deliberately stay out after midnight, either to dare the ghosts to challenge them or simply for the thrill of bucking tradition. Every Night of the Pale, it seems, there are disappearances among those who stay out after midnight, although whether these vanishings are the result of dissatisfied locals taking the opportunity to run away from home, murderers or wild animals or other mundane dangers, or the vengeful spirits carrying off their victims depends upon the circumstances.\n\nThe morning after a Night of the Pale is also the first day of the new year—a time that many celebrate more as a relief for surviving the night before than in anticipation of what the new year might bring, although regional preferences for how this day is celebrated vary enough that no single tradition holds over the other. Save, of course, the lingering fears of what dread spirits might come knocking upon warded doors one year away...",
                id: "824563",
                note: null,
                date: {
                    day: 31,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Turning Day",
                description:
                    "Alseta\n\nThe changing of the year is celebrated with the forgiveness of old debts and grudges, and embracing new opportunities.",
                id: "824564",
                note: null,
                date: {
                    day: 31,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Ritual of Stardust",
                description:
                    "Desna\n\nThe Ritual of Stardust is one of the few formal religious holidays in honor of the goddess Desna. It is held on both the summer and winter solstices.\n\nFollowers of the Song of Spheres gather at dusk and light enormous bonfires and hold feasts, watching the sparks and embers float out into the darkening sky. After it is fully dark, the celebrants chant and sing songs as they watch the fires burn low. When only embers remain, sand mixed with ground star gems (either star rubies, star sapphires, or rose quartz) is thrown on them or into the air downwind. At this point it is common to make proclamations of love and friendship and of promised journeys to come. The twinkling of the sand is thought to mirror the night sky and demonstrate Desna's witnessing of these pronouncements.",
                id: "824565",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Planting Week",
                description:
                    "Erastil\n\nThis holy week to the god Erastil is a time of heavy work in the fields for farmers.",
                id: "824566",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Ascendance Night",
                description:
                    "Norgorber\n\nDay marking the apotheosis of the Reaper of Reputation.",
                id: "824567",
                note: null,
                date: {
                    day: 2,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Azvadeva Dejal",
                description:
                    "Gruhastha\n\nCelebration of the revelation of the Azvadeva Pujila, with gifts of books, celebrations of knowledge, blessing of animals, and a vegetarian feast.",
                id: "824568",
                note: null,
                date: {
                    day: 3,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Goblin Flea Market",
                description:
                    "Andoran\n\nA market day that focuses on unusual crafts and offers games to children who dress up for the occasion.",
                id: "824569",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Breaching Festival",
                description:
                    "Korvosa\n\nYearly festival in which contestants try to break through the magical wards protecting the Academae.",
                id: "824570",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Silverglazer Sunday",
                description:
                    "Andoran\n\nSilverglazer Sunday is a two-part Andoren national festival that is held on the last Sunday of Arodus and the first Sunday of Rova every year. Celebrants spend the two Sundays fishing, holding swimming competitions, and making enormous puppets.",
                id: "824571",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Batul al-Alim",
                description:
                    "Qadira\n\nBatul al-Alim is a holiday celebrated on the last Oathday of Calistril in Qadira. It commemorates the birthday of the popular romantic poet of the same name.",
                id: "824572",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: 1
                },
                category: null
            }
        ],
        id: null,
        categories: [
            {
                name: "Natural Events",
                id: "natural-events",
                color: "#2E7D32"
            },
            {
                name: "Religious Holidays",
                id: "religious-holidays",
                color: "#9b2c2c"
            },
            {
                name: "Secular Holidays",
                id: "secular-holidays",
                color: "#0D47A1"
            },
            {
                name: "Historical Events",
                id: "historical-events",
                color: "#455A64"
            },
            {
                name: "Miscellaneous Events",
                id: "miscellaneous-events",
                color: "#0288D1"
            }
        ]
    },
    {
        name: "Calendar of Galifar",
        description: "Calendar of the world of Eberron.",
        static: {
displayDayNumber:false,
            firstWeekDay: 0,
            incrementDay: false,
            displayMoons: true,
            overflow: false,
            weekdays: [
                {
                    type: "day",
                    name: "Sul",
                    id: "ID_598a7bd9b8b9"
                },
                {
                    type: "day",
                    name: "Mol",
                    id: "ID_69088ac8f818"
                },
                {
                    type: "day",
                    name: "Zol",
                    id: "ID_a8c85a98f8fa"
                },
                {
                    type: "day",
                    name: "Wir",
                    id: "ID_fa4b687aaba9"
                },
                {
                    type: "day",
                    name: "Zor",
                    id: "ID_58e9a82a6bc8"
                },
                {
                    type: "day",
                    name: "Far",
                    id: "ID_9a18cb889ada"
                },
                {
                    type: "day",
                    name: "Sar",
                    id: "ID_3b9bfa38c979"
                }
            ],
            months: [
                {
                    name: "Zarantyr",
                    type: "month",
                    length: 28,
                    id: "ID_7a8afb09aa6a"
                },
                {
                    name: "Olarune",
                    type: "month",
                    length: 28,
                    id: "ID_386b188b2a89"
                },
                {
                    name: "Therendor",
                    type: "month",
                    length: 28,
                    id: "ID_599a0ad859c8"
                },
                {
                    name: "Eyre",
                    type: "month",
                    length: 28,
                    id: "ID_98a95869e90b"
                },
                {
                    name: "Dravago",
                    type: "month",
                    length: 28,
                    id: "ID_eb5a194bcbf8"
                },
                {
                    name: "Nymm",
                    type: "month",
                    length: 28,
                    id: "ID_bb596aa9ca5b"
                },
                {
                    name: "Lharvion",
                    type: "month",
                    length: 28,
                    id: "ID_fb1bb9dabb88"
                },
                {
                    name: "Barrakas",
                    type: "month",
                    length: 28,
                    id: "ID_8bcb19c8f90a"
                },
                {
                    name: "Rhaan",
                    type: "month",
                    length: 28,
                    id: "ID_0a09eb5b7b9b"
                },
                {
                    name: "Sypheros",
                    type: "month",
                    length: 28,
                    id: "ID_3b98ab1a29e8"
                },
                {
                    name: "Aryth",
                    type: "month",
                    length: 28,
                    id: "ID_899b59faaba9"
                },
                {
                    name: "Vult",
                    type: "month",
                    length: 28,
                    id: "ID_8a286b78aac9"
                }
            ],
            moons: [
                {
                    name: "Nymm",
                    cycle: 28,
                    offset: -14,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_a8b88988a94a"
                },
                {
                    name: "Sypheros",
                    cycle: 35,
                    offset: -11,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_5ba80b4b096a"
                },
                {
                    name: "Therendor",
                    cycle: 42,
                    offset: 21,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_c999085a499b"
                },
                {
                    name: "Rhaan",
                    cycle: 49,
                    offset: 9,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_39f91ab8a85a"
                },
                {
                    name: "Olarune",
                    cycle: 56,
                    offset: 27,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_2ada8b99788b"
                },
                {
                    name: "Eyre",
                    cycle: 63,
                    offset: 10,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_49285b79d988"
                },
                {
                    name: "Vult",
                    cycle: 70,
                    offset: 6,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_eaebb94a9acb"
                },
                {
                    name: "Zarantyr",
                    cycle: 77,
                    offset: 31,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_98d86aabcbb9"
                },
                {
                    name: "Aryth",
                    cycle: 84,
                    offset: 41,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_d989b809d97b"
                },
                {
                    name: "Dravago",
                    cycle: 91,
                    offset: 31,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_1a293959eaab"
                },
                {
                    name: "Lharvion",
                    cycle: 98,
                    offset: 34,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_cbf919491a5b"
                },
                {
                    name: "Barrakas",
                    cycle: 105,
                    offset: -11,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_4a1a2a6b589b"
                }
            ],
            leapDays: [],
            eras: []
        },
        current: {
            year: 998,
            day: 1,
            month: 0
        },
        events: [
            {
                name: "The Tain Gala - Sharn",
                description:
                    "The Tain Gala is a notable event held on the first Far of each month in Sharn.",
                id: "824461",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Revelation Day - Blood of Vol",
                description:
                    "Meditation ceremony for Seekers (also called Ascension Day).",
                id: "824462",
                note: null,
                date: {
                    day: 13,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Winter Solstice",
                description: "The longest night of the year.",
                id: "824463",
                note: null,
                date: {
                    day: 14,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Rebirth Eve - The Silver Flame",
                description:
                    "The Purified new year; a night for spiritual vigil and guarding against evil. ",
                id: "824464",
                note: null,
                date: {
                    day: 14,
                    year: null,
                    month: 0
                },
                category: null
            },
            {
                name: "Crystalfall - Sharn",
                description:
                    "A day of remembrance; Ice sculptures are created (and destroyed) to commemorate the destruction of the Glass Tower on 9 Olarune in 918 by abjurers. ",
                id: "824465",
                note: null,
                date: {
                    day: 9,
                    year: 998,
                    month: 1
                },
                category: null
            },
            {
                name: "Bright Souls' Day - The Silver Flame",
                description:
                    "On this day each year, the Purified celebrate the lives and sacrifice of all followers of the Flame who died while fighting evil and protecting the faithful. ",
                id: "824466",
                note: null,
                date: {
                    day: 18,
                    year: null,
                    month: 1
                },
                category: null
            },
            {
                name: "The Day of Mourning - Sharn",
                description:
                    "In commemoration of the destruction of the nation of Cyre, those who survived gather to remember the loss of their kingdom on this date in the year 994. ",
                id: "824467",
                note: null,
                date: {
                    day: 20,
                    year: 995,
                    month: 1
                },
                category: null
            },
            {
                name: "Tirasday - The Silver Flame",
                description:
                    "On this day, the Silver Flame work, give gifts, and partake in joyous celebration out of thankfulness for the new planting season and the birth of Tira Miron - the Voice of the Silver Flame.",
                id: "824468",
                note: null,
                date: {
                    day: 5,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Sun's Blessing - The Sovereign Host",
                description:
                    "The Sovereign Host enjoys this festival of peace, and of setting aside differences, in the name of Dol Arrah.",
                id: "824469",
                note: null,
                date: {
                    day: 15,
                    year: null,
                    month: 2
                },
                category: null
            },
            {
                name: "Initiation Day - The Silver Flame",
                description:
                    "Seminary graduations and breaking grounds for new churches are common on this day as the Silver Flame recalls their declarations of independent faith and the construction of their first cathedral on this special day each year. ",
                id: "824470",
                note: null,
                date: {
                    day: 11,
                    year: null,
                    month: 3
                },
                category: null
            },
            {
                name: "Baker's Night - The Silver Flame",
                description:
                    "An old and misunderstood, yet immensely popular, holiday wherein followers of the Silver Flame gather to share pastries and treats created by bakers within their fold. ",
                id: "824471",
                note: null,
                date: {
                    day: 6,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Aureon's Crown - Sharn and The Sovereign Host",
                description:
                    "The Sovereign Host celebrate knowledge on this day with lectures and sermons.Secular institutions hold graduation and commencement ceremonies on this date, as do the monastic schools of the Silver Flame.In Sharn this has become a common secular holiday, wherein even non-devout members of the Five Nations attend lectures and sermons held by the priests of Aureon on philosophical, historical, and a range of other topics - including discussions on the nature of the gods.\n\n",
                id: "824472",
                note: null,
                date: {
                    day: 26,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Promisetide - The Silver Flame",
                description:
                    "A controversial holiday outside of the Silver Flame faith, on this day the Purified honor the Silver Flame for the promise of paradise. They also honor (without worship) the Sovereign Host for having created the world, before stepping aside to allow the Flame its rightful place as the last god of Eberron.  ",
                id: "824473",
                note: null,
                date: {
                    day: 28,
                    year: null,
                    month: 4
                },
                category: null
            },
            {
                name: "Brightblade - Sharn and The Sovereign Host",
                description:
                    "This Sovereign Host festival, dedicated to Dol Dorn, is marked by gladiatorial and athletic contests. \n\nIn Sharn, festival celebrations occur throughout the temple districts with events culminating in a combined contest of champions at the Cornerstone Arena. ",
                id: "824474",
                note: null,
                date: {
                    day: 12,
                    year: null,
                    month: 5
                },
                category: null
            },
            {
                name: "First Dawn - The Silver Flame",
                description:
                    "On this day in 914, the Church of the Silver Flame officially assumed control of the government of Thrane. On each anniversary, the Purified give thanks for their just rule, while also honoring the memory of King Thalin, whose death paved the way for their governance.",
                id: "824475",
                note: null,
                date: {
                    day: 21,
                    year: 915,
                    month: 5
                },
                category: null
            },
            {
                name: "Silvertide - The Silver Flame",
                description:
                    "Commemoration of both the couatl sacrifice and the entry, thousands of years ago, of the Silver Flame into Eberron mark this highest of holy days. The vast majority of Purified spend this day in prayer and observance.  ",
                id: "824476",
                note: null,
                date: {
                    day: 14,
                    year: null,
                    month: 6
                },
                category: null
            },
            {
                name: "The Race of Eight Winds - Sharn",
                description:
                    "Legend tells of King Galifar II's fascination with aerial scouts and cavalry. The evolution of this annual contest took centuries, but has given Sharn an exotic and well anticipated event involving beasts and their riders in a symbiotic quest for glory* over a course that finds them weaving through the spires of the city. \n\n\n\n*the winner also receives 500gp and a land grant located elsewhere in Breland.",
                id: "824477",
                note: null,
                date: {
                    day: 21,
                    year: 201,
                    month: 6
                },
                category: null
            },
            {
                name: "The Hunt - Sharn and The Sovereign Host",
                description:
                    "The Sovereign Host celebrate Balinor with communal hunts of dangerous creatures. \n\nIn Sharn, a dangerous beast*, whose transport to the city was arranged by the priests of Balinor, is released into the Depths of the Lower-City. Open to any who would participate (and pay an entry fee in the form of a 5gp donation), the victor must return with the beast's head to receive a 500gp purse, local fame, and the blessing of Balinor. \n\n\n\n*often a singular beast, it can be several - which then requires the victor to return with the most skins. ",
                id: "824478",
                note: null,
                date: {
                    day: 4,
                    year: null,
                    month: 7
                },
                category: null
            },
            {
                name: "Victory Day - The Silver Flame",
                description:
                    "Commemorating the conclusion of the lycanthropic purge (832 YK - 880 YK), on Victory Day the adult faithful of the Silver Flame attend sermons on triumph, defeat, and the somewhat questionable methods utilized by the templars during the purge - while the children of the faithful act out great battles with toy swords. ",
                id: "824479",
                note: null,
                date: {
                    day: 9,
                    year: 881,
                    month: 7
                },
                category: null
            },
            {
                name: "Fathen's Fall - Sharn",
                description:
                    "Honoring the memory of Fathen, a great hero of the Silver Crusade (832 YK - 880 YK), who, in the last days of the purge, was torn apart by wererats on the streets of North Market. Faithful gather on this day at the Shrine of Fathen the Martyr to listen to a sermon from the priest of High Hope. This holiday is often uncomfortable and tense for shifter communities in Sharn. ",
                id: "824480",
                note: null,
                date: {
                    day: 25,
                    year: 881,
                    month: 7
                },
                category: null
            },
            {
                name: "Boldrei's Feast - Sharn and The Sovereign Host",
                description:
                    "A feast of community in the name of Boldrei, extravagant parties are often held on this holiday and it has also become the traditional day for elections. \n\nIn Sharn, a great feast is held at the Pavilion of the Host with goods and services donated  from local merchants, as well as House Ghallanda. Many grand parties, some quite astonishing in their opulence, are hosted by the wealthiest members of varying districts - often in competition with one another for social standing. ",
                id: "824481",
                note: null,
                date: {
                    day: 9,
                    year: null,
                    month: 8
                },
                category: null
            },
            {
                name: "The Ascension - Sharn",
                description:
                    "Each year on The Ascension, followers reaffirm their faith and give thanks as well as attend blessing ceremonies at temples throughout the city - the grandest of which occurs at the Cathedral of the Cleansing Flame. All of this is to honor the sacrifice of Tira Miron, the Voice of the Flame, without which there would be no Church of the Silver Flame. Contributions to their community on this day are a high priority for the faithful.",
                id: "824482",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Wildnight - Sharn",
                description:
                    "With the The Fury (the Sovereign of Passion and Madness) reaching the height of her power on this night, people find it difficult to control or restrain their impulses - once the sun sets, public revelry in the streets climbs to joyous or, all too often, dangerous levels, calming only as the sun rises on the following morning. ",
                id: "824483",
                note: null,
                date: {
                    day: 18,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Saint Voltros's Day - The Silver Flame",
                description:
                    "Though one of the least high holy days, it is marked by brief prayers and church services in the honor of the birth of Saint Voltros - the first paladin called to only serve the Silver Flame.",
                id: "824484",
                note: null,
                date: {
                    day: 25,
                    year: null,
                    month: 9
                },
                category: null
            },
            {
                name: "Thronehold - Sharn",
                description:
                    "On this day in 996, the Treaty of Thronehold was signed, formally ending the Last War. Annual celebratory feasts are held throughout the Five Nations to mark this auspicious and long-awaited event. ",
                id: "824485",
                note: null,
                date: {
                    day: 11,
                    year: 997,
                    month: 10
                },
                category: null
            },
            {
                name: "Rampartide - The Silver Flame",
                description:
                    "In accordance with scripture, on this day the Purified steel themselves against wickedness, both without and within, through repentance and fasting. Children, elderly, and the sick are required only to give up their favorite foods for the day. ",
                id: "824486",
                note: null,
                date: {
                    day: 24,
                    year: null,
                    month: 10
                },
                category: null
            },
            {
                name: "Long Shadows - Sharn",
                description:
                    "As dark magic dominates over these three days of the Long Shadows, the myth of Sovereign Lord Aureon's stolen shadow is forefront in the minds of the people. Most will spend these days indoors huddled around the warmth of a fire, but those few who worship the dark deity use this time to prey upon the weak and the foolish. ",
                id: "824487",
                note: null,
                date: {
                    day: 26,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Khybersef - The Silver Flame",
                description:
                    'Originally called Khyber\'s Eve, the Purified spend the night in intense prayer and spiritual vigilance against the, according to scripture, "thinning of the bonds that hold the demon lords in Khyber" between now (the beginning of winter) and the solstice. Quests and crusades often begin on Khybersef. ',
                id: "824488",
                note: null,
                date: {
                    day: 27,
                    year: null,
                    month: 11
                },
                category: null
            },
            {
                name: "Spring Equinox",
                description:
                    "The spring equinox is when the day and the night are equally as long, and are getting longer.",
                id: "824489",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Summer Solstice",
                description:
                    "\tAt the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.",
                id: "824490",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Autumn Equinox",
                description:
                    "The autumn equinox is when the day and the night are equally as long, and are getting shorter.",
                id: "824491",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            }
        ],
        id: null,
        categories: []
    },
    {
        name: "Barovian Calendar",
        description: "Calendar of the realm of Barovia, home of Strahd.",
        static: {
displayDayNumber:false,
            firstWeekDay: 0,
            incrementDay: false,
            displayMoons: true,
            overflow: true,
            weekdays: [
                {
                    type: "day",
                    name: "Monday",
                    id: "ID_6a183b08c8eb"
                },
                {
                    type: "day",
                    name: "Tuesday",
                    id: "ID_892b7b7a5ae9"
                },
                {
                    type: "day",
                    name: "Wednesday",
                    id: "ID_6bb98899ba68"
                },
                {
                    type: "day",
                    name: "Thursday",
                    id: "ID_4a7b683aea19"
                },
                {
                    type: "day",
                    name: "Friday",
                    id: "ID_78690a099b89"
                },
                {
                    type: "day",
                    name: "Saturday",
                    id: "ID_ba5b09ba5a89"
                },
                {
                    type: "day",
                    name: "Sunday",
                    id: "ID_29b90acaead9"
                }
            ],
            months: [
                {
                    name: "1st Moon",
                    type: "month",
                    length: 31,
                    id: "ID_7b4978ab581a"
                },
                {
                    name: "2nd Moon",
                    type: "month",
                    length: 28,
                    id: "ID_cb99fbb9395b"
                },
                {
                    name: "3rd Moon",
                    type: "month",
                    length: 31,
                    id: "ID_79881a89cb18"
                },
                {
                    name: "4th Moon",
                    type: "month",
                    length: 30,
                    id: "ID_5b9a8a397908"
                },
                {
                    name: "5th Moon",
                    type: "month",
                    length: 31,
                    id: "ID_f8399ab80818"
                },
                {
                    name: "6th Moon",
                    type: "month",
                    length: 30,
                    id: "ID_3ac84a7bc869"
                },
                {
                    name: "7th Moon",
                    type: "month",
                    length: 31,
                    id: "ID_e98bc86bc809"
                },
                {
                    name: "8th Moon",
                    type: "month",
                    length: 31,
                    id: "ID_89ea78ca5988"
                },
                {
                    name: "9th Moon",
                    type: "month",
                    length: 30,
                    id: "ID_798a3b990a4b"
                },
                {
                    name: "10th Moon",
                    type: "month",
                    length: 31,
                    id: "ID_3a9999e8eb59"
                },
                {
                    name: "11th Moon",
                    type: "month",
                    length: 30,
                    id: "ID_db39383b990a"
                },
                {
                    name: "12th Moon",
                    type: "month",
                    length: 31,
                    id: "ID_1bfa3b180a48"
                }
            ],
            moons: [
                {
                    name: "Moon",
                    cycle: 29.530588853,
                    offset: 10.24953,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_e98b3a8ab8da"
                }
            ],
            leapDays: [
                {
                    name: "Leap Day",
                    type: "leapday",
                    interval: [
                        {
                            ignore: false,
                            exclusive: false,
                            interval: 400
                        },
                        {
                            ignore: false,
                            exclusive: true,
                            interval: 100
                        },
                        {
                            ignore: false,
                            exclusive: false,
                            interval: 4
                        }
                    ],
                    offset: 0,
                    timespan: 1,
                    intercalary: false,
                    id: "ID_6a28dbb81a48"
                }
            ],
            eras: [
                {
                    name: "Before Christ",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: -9000,
                        month: 0,
                        day: 0
                    }
                },
                {
                    name: "Anno Domini",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: 1,
                        month: 0,
                        day: 1
                    }
                }
            ]
        },
        current: {
            year: 735,
            day: 1,
            month: 0
        },
        events: [
            {
                name: "Winter Solstice",
                description:
                    "The Winter Solstice is the day of the year with the least time between sunrise and sunset. Many western cultures consider it the official start of winter.",
                id: "824455",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-event"
            },
            {
                name: "Summer Solstice",
                description:
                    "The Summer Solstice is the day of the year with the most time between \nsunrise and sunset. Many western cultures consider it the official start\n of summer.",
                id: "824456",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-event"
            },
            {
                name: "Spring Equinox",
                description:
                    "The Spring Equinox,\nalso called the Vernal Equinox, is the day between the winter and\nsummer solstices where the day is the exact same length as the night.\nMany western cultures consider it the official start of Spring.\n",
                id: "824457",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-event"
            },
            {
                name: "Autumnal Equinox",
                description:
                    "The Autumnal Equinox,\nalso called the Fall Equinox, is the midpoint between the summer and\nwinter solstices, where the day is the exact same length as the night.\nMany western cultures consider it the official start of Autumn.\n",
                id: "824458",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "New Year's Day",
                description: "New Year's day marks the start of a new year.",
                id: "824459",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Paschal Full Moon",
                description:
                    "The first full moon after march 21st, which is considered the fixed date for the spring equinox.",
                id: "824460",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-event"
            }
        ],
        id: null,
        categories: [
            {
                name: "Natural Event",
                id: "natural-event",
                color: "#9e9d24"
            }
        ]
    },
    {
        name: "Exandrian Calendar",
        description: "Calendar of the world of Wildemount.",
        static: {
displayDayNumber:false,
            firstWeekDay: 2,
            incrementDay: false,
            displayMoons: true,
            overflow: true,
            weekdays: [
                {
                    type: "day",
                    name: "Miresen",
                    id: "ID_3b38aaa81bca"
                },
                {
                    type: "day",
                    name: "Grissen",
                    id: "ID_da6b19882baa"
                },
                {
                    type: "day",
                    name: "Whelsen",
                    id: "ID_a9cae8f88b98"
                },
                {
                    type: "day",
                    name: "Conthsen",
                    id: "ID_e87859eb5aaa"
                },
                {
                    type: "day",
                    name: "Folsen",
                    id: "ID_59180abbea8a"
                },
                {
                    type: "day",
                    name: "Yulisen",
                    id: "ID_98082bd8d8ca"
                },
                {
                    type: "day",
                    name: "Da'leysen",
                    id: "ID_da4ba92b299a"
                }
            ],
            months: [
                {
                    name: "Horisal",
                    type: "month",
                    length: 29,
                    id: "ID_e89a4ab9995b"
                },
                {
                    name: "Misuthar",
                    type: "month",
                    length: 30,
                    id: "ID_18b8894bab7b"
                },
                {
                    name: "Dualahei",
                    type: "month",
                    length: 30,
                    id: "ID_0a9b29f8f8db"
                },
                {
                    name: "Thunsheer",
                    type: "month",
                    length: 31,
                    id: "ID_6a8a8a5bea5b"
                },
                {
                    name: "Unndilar",
                    type: "month",
                    length: 28,
                    id: "ID_b8295bdbcafa"
                },
                {
                    name: "Brussendar",
                    type: "month",
                    length: 31,
                    id: "ID_c92a489bb909"
                },
                {
                    name: "Sydenstar",
                    type: "month",
                    length: 32,
                    id: "ID_7b48bb1b0a4a"
                },
                {
                    name: "Fessuran",
                    type: "month",
                    length: 29,
                    id: "ID_289858c97849"
                },
                {
                    name: "Quen'pillar",
                    type: "month",
                    length: 27,
                    id: "ID_f8abd9a86aa9"
                },
                {
                    name: "Cuersaar",
                    type: "month",
                    length: 29,
                    id: "ID_7aba59fa2b69"
                },
                {
                    name: "Duscar",
                    type: "month",
                    length: 32,
                    id: "ID_5819f86b99cb"
                }
            ],
            moons: [
                {
                    name: "Catha",
                    cycle: 33,
                    offset: 7,
                    faceColor: "#ffffff",
                    shadowColor: "#292b4a",
                    id: "ID_0ab929092b5b"
                },
                {
                    name: "Ruidus",
                    cycle: 328,
                    offset: 80,
                    faceColor: "#ff6161",
                    shadowColor: "#1f1f1f",
                    id: "ID_b9783ac818e9"
                }
            ],
            leapDays: [],
            eras: [
                {
                    name: "The Founding",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: 1,
                        month: 0,
                        day: 1
                    }
                },
                {
                    name: "Age of Arcanum",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: -1500,
                        month: 0,
                        day: 1
                    }
                },
                {
                    name: "The Calamity",
                    description: "",
                    format: "Year {{year}} - {{era_name}}",
                    start: {
                        year: -665,
                        month: 0,
                        day: 1
                    }
                },
                {
                    name: "Post-Divergence",
                    description: "",
                    format: "Year {{year}} P.D.",
                    start: {
                        year: 1,
                        month: 0,
                        day: 1
                    }
                }
            ]
        },
        current: {
            day: 1,
            month: 0,
            year: 836
        },
        events: [
            {
                name: "Spring Equinox",
                description:
                    "The spring equinox is when the day and the night are equally as long, and are getting longer.",
                id: "824430",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Summer Solstice",
                description:
                    "\tAt the summer solstice, the Sun travels the longest path through the sky, and that day therefore has the most daylight.",
                id: "824431",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Autumn Equinox",
                description:
                    "The autumn equinox is when the day and the night are equally as long, and are getting shorter.",
                id: "824432",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "Winter Solstice",
                description:
                    "The winter solstice marks the shortest day and longest night of the year, when the sun is at its lowest arc in the sky.",
                id: "824433",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: null
            },
            {
                name: "New Dawn",
                description:
                    "The first day of the new year is also the holy day of the Changebringer, as the old year gives way to a new path.\n\nIn Tal'Dorei, Emon celebrates New Dawn with a grand midnight feast, which commonly features a short play celebrating the changes witnessed in the past year.\n\nOn the Menagerie Coast, people celebrate by having a feast on the shore at dusk to watch the sunset. They feast and discuss their hopes for the new year until the sun rises.",
                id: "824434",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 0
                },
                category: "religious-holidays"
            },
            {
                name: "Hillsgold",
                description:
                    "This holiday is up to the calendar owner to decide what it is for! :)",
                id: "824435",
                note: null,
                date: {
                    day: 27,
                    year: null,
                    month: 0
                },
                category: "secular-holidays"
            },
            {
                name: "Day of Challenging",
                description:
                    "The holy day of the Stormlord is one of the most raucous holidays in Emon. Thousands of spectators attend the annual Godsbrawl, which is held in the fighting ring within the Temple of the Stormlord. The people root for their deity's favored champion, and there is a fierce (yet friendly) rivalry between the Champion of the Stormlord and the Champion of the Platinum Dragon. The winner earns the title of \"Supreme Champion\" for an entire year.\n\nThe Day of Challenging is one of the most raucous holidays in Port Damali, and thousands of spectators attend the annual Godsbrawl held in the Temple of Kord to root for their favored deity's champion, particularly the chosen champions of the Storm Lord and the All-Hammer. ",
                id: "824436",
                note: null,
                date: {
                    day: 7,
                    year: null,
                    month: 1
                },
                category: "religious-holidays"
            },
            {
                name: "Renewal Festival",
                description:
                    "Spring begins early in the month of Dualahei, officially starting on the 13th with the Renewal Festival.",
                id: "824437",
                note: null,
                date: {
                    day: 13,
                    year: null,
                    month: 2
                },
                category: "secular-holidays"
            },
            {
                name: "Wild's Grandeur",
                description:
                    "Though the Archeart is the god of spring, the peak of the spring season is the holy day of the Wildmother.\n\nThe people in the southern wilds of Tal'Dorei celebrate the Wildmother's strength by journeying to a place of great natural beauty. This could be the top of a mountainous waterfall, the center of a desert, or even an old and peaceful city park (such as Azalea Street Park in Emon). Though Emon rarely celebrates Wild's Grandeur, the few who do will plant trees in observance of the holiday.\n\nThe people of the Menagerie Coast set aside this day to sail for no reason other than the pleasure of observing the natural beauty of their surroundings. Those who still partake in elements of Ki'Nau culture take this day to appreciate the fruits and foods granted by the sea, leaving offerings of delicacies and small handmade crafts at temporary altars of twisted roots and grasses.",
                id: "824438",
                note: null,
                date: {
                    day: 20,
                    year: null,
                    month: 2
                },
                category: "religious-holidays"
            },
            {
                name: "Harvest's Rise",
                description:
                    "This holiday is up to the calendar owner to decide what it is for! :)",
                id: "824439",
                note: null,
                date: {
                    day: 11,
                    year: null,
                    month: 3
                },
                category: "secular-holidays"
            },
            {
                name: "Merryfrond's Day",
                description:
                    "This holiday is up to the calendar owner to decide what it is for! :)",
                id: "824440",
                note: null,
                date: {
                    day: 31,
                    year: null,
                    month: 3
                },
                category: "secular-holidays"
            },
            {
                name: "Deep Solace",
                description:
                    "Moradin's holy day is Deep Solace, which is celebrated on the eighteenth day of the fifth month. Especially devout followers of the All-Hammer spend the day in isolation, meditating on the meaning of family and how they may be better mothers, fathers, siblings, and children.\n\nThe dwarven communities across Exandria, such as the ones in Grimgolir and Kraghammer, celebrate with a full day of feasting and drinking. ",
                id: "824441",
                note: null,
                date: {
                    day: 18,
                    year: null,
                    month: 4
                },
                category: "religious-holidays"
            },
            {
                name: "Zenith",
                description:
                    "Summer begins in the middle of Unndilar, officially starting at noon on the 26th day known as the Zenith.",
                id: "824442",
                note: null,
                date: {
                    day: 26,
                    year: null,
                    month: 4
                },
                category: "secular-holidays"
            },
            {
                name: "Artisan's Faire",
                description:
                    "This holiday is up to the calendar owner to decide what it is for! :)",
                id: "824443",
                note: null,
                date: {
                    day: 15,
                    year: null,
                    month: 5
                },
                category: "secular-holidays"
            },
            {
                name: "Elvendawn",
                description:
                    "Corellon's holy day is called Elvendawn,\nor Midsummer. It is celebrated on the twentieth day\nof the sixth month, and commemorates the elves' first\nemergence from the Feywild.\n\nIn Syngorn, the Elves open small doorways into the Feywild and celebrate alongside the wild fey with uncharacteristic vigor.\n\nThough the Dwendalian\nEmpire doesn't promote the worship of the Arch Heart,\nthe elves of Bysaes Tyl quietly celebrate in private by\nopening small doors to the Feywild and having a little\nmore wine than usual. ",
                id: "824444",
                note: null,
                date: {
                    day: 20,
                    year: null,
                    month: 5
                },
                category: "religious-holidays"
            },
            {
                name: "Highsummer",
                description:
                    "The holy day of the Dawnfather is the peak of the summer season.\n\nEmon celebrates with an entire week of gift-giving and feasting, ending at midnight on the 21st of Sydenstar (the anniversary of the Battle of the Umbra Hills, where Zan Tal'Dorei dethroned Trist Drassig).\n\nWhitestone (where the Dawnfather is the city's patron god) celebrates with gift-giving and a festival of lights around the Sun Tree. Due to the Briarwood occupation, money is thin, so most Whitestone folk choose to recount the small things they are thankful for, rather than buy gifts.\n\nWhile other parts of Exandria feast, the Dwendalian\nEmpire uses this day as an opportunity to enlist more\nsoldiers in its army. The military holds great feasts and\nhands out toy soldiers and other propaganda, encouraging people to enlist and help fight against the evil that\nthreatens the king. ",
                id: "824445",
                note: null,
                date: {
                    day: 7,
                    year: null,
                    month: 6
                },
                category: "religious-holidays"
            },
            {
                name: "Morn of Largesse",
                description:
                    "This holiday is up to the calendar owner to decide what it is for! :)",
                id: "824446",
                note: null,
                date: {
                    day: 14,
                    year: null,
                    month: 6
                },
                category: "secular-holidays"
            },
            {
                name: "Harvest's Close",
                description:
                    "Autumn begins on the 3rd of Fessuran and is typically celebrated with feasting in rural regions and with carnivals in the cities. ",
                id: "824447",
                note: null,
                date: {
                    day: 3,
                    year: null,
                    month: 7
                },
                category: "secular-holidays"
            },
            {
                name: "The Hazel Festival",
                description:
                    "This holiday is up to the calendar owner to decide what it is for! :)",
                id: "824448",
                note: null,
                date: {
                    day: 12,
                    year: null,
                    month: 8
                },
                category: "secular-holidays"
            },
            {
                name: "Civilization's Dawn",
                description:
                    "The Law Bearer's holy day is Civilization's\nDawn, which is celebrated on the autumnal equinox,\nusually the twenty-second day of the ninth month.\n\nEmon celebrates with a great bonfire in the square of each neighborhood, around which each community dances and gives gifts.\n\nIn the\nDwendalian Empire, people celebrate by having feasts \nin honor of the laws of the Dwendal bloodline. One seat\nat every table is left open for the king, who eats in spirit\nwith the people he rules. ",
                id: "824449",
                note: null,
                date: {
                    day: 22,
                    year: null,
                    month: 8
                },
                category: "religious-holidays"
            },
            {
                name: "Night of Ascension",
                description:
                    "The Raven Queen's holy day is called the Night of Ascension, celebrating her apotheosis. The actual date of the her rise to divinity is unclear, but the Night of Ascension is celebrated on the thirteenth day of the tenth month.\n\nThough most in Emon see this celebration of the dead as unnerving and macabre, the followers of the Matron of Ravens believe that the honored dead would prefer to be venerated with cheer, not misery.\n\nWhat was once a night of cheery celebration of the dead in the Dwendalian Empire has recently become an occasion to burn effigies and decry the Kryn Dynasty for their unnatural relationship with death.",
                id: "824450",
                note: null,
                date: {
                    day: 13,
                    year: null,
                    month: 9
                },
                category: "religious-holidays"
            },
            {
                name: "Zan's Cup",
                description:
                    "This holiday is up to the calendar owner to decide what it is for! :)",
                id: "824451",
                note: null,
                date: {
                    day: 21,
                    year: null,
                    month: 9
                },
                category: "secular-holidays"
            },
            {
                name: "Barren Eve",
                description:
                    "Winter begins on the 2nd day of Duscar, the Barren Eve, which is a nighttime celebration and remembrance of those who fell in battle.",
                id: "824452",
                note: null,
                date: {
                    day: 2,
                    year: null,
                    month: 10
                },
                category: "secular-holidays"
            },
            {
                name: "Embertide",
                description:
                    "Bahamut's holy day is called Embertide, and is celebrated on the fifth day of Duscar. This is a day of remembrance, solemnity, and respect for those who have fallen in the defense of others.",
                id: "824453",
                note: null,
                date: {
                    day: 5,
                    year: null,
                    month: 10
                },
                category: "religious-holidays"
            },
            {
                name: "Winter's Crest",
                description:
                    "This day celebrates the freedom of Tal'Dorei from Errevon the Rimelord. It is the peak of the winter season, so devout followers of the Matron of Ravens (as the goddess of winter) consider it to be one of her holy days.\n\nHowever, in most of the land, people see Winter's Crest as a secular holiday, often celebrated with omnipresent music in public areas, lavish gift-giving to relatives and loved ones, and the cutting and decorating of trees placed indoors. The Sun Tree in Whitestone is often decorated with lights and other baubles for Winter's Crest.",
                id: "824454",
                note: null,
                date: {
                    day: 20,
                    year: null,
                    month: 10
                },
                category: "secular-holidays"
            }
        ],
        id: null,
        categories: [
            {
                name: "Religious Holidays",
                id: "religious-holidays",
                color: "#0D47A1"
            },
            {
                name: "Secular Holidays",
                id: "secular-holidays",
                color: "#4A148C"
            }
        ]
    },
    {
        name: "Calendar of Harptos",
        description: "Calendar of Faerûn of the Forgotten Realms.",
        static: {
displayDayNumber:false,
            firstWeekDay: 0,
            incrementDay: false,
            displayMoons: true,
            overflow: false,
            weekdays: [
                {
                    type: "day",
                    name: "I",
                    id: "ID_9999882bb94a"
                },
                {
                    type: "day",
                    name: "II",
                    id: "ID_8a0b4b79d888"
                },
                {
                    type: "day",
                    name: "III",
                    id: "ID_da483aca8bf9"
                },
                {
                    type: "day",
                    name: "IV",
                    id: "ID_a8fbea39cac8"
                },
                {
                    type: "day",
                    name: "V",
                    id: "ID_9b19d9787b0b"
                },
                {
                    type: "day",
                    name: "VI",
                    id: "ID_382a590a8a28"
                },
                {
                    type: "day",
                    name: "VII",
                    id: "ID_fbca0ab80afb"
                },
                {
                    type: "day",
                    name: "VIII",
                    id: "ID_ca093bca5ad9"
                },
                {
                    type: "day",
                    name: "IX",
                    id: "ID_d95b39098bf8"
                },
                {
                    type: "day",
                    name: "X",
                    id: "ID_389bfb5858db"
                }
            ],
            months: [
                {
                    name: "Hammer (Deepwinter)",
                    type: "month",
                    length: 30,
                    id: "ID_cbeb4b190b6a"
                },
                {
                    name: "Midwinter",
                    type: "intercalary",
                    length: 1,
                    id: "ID_89bad9089b7b"
                },
                {
                    name: "Alturiak (The Claw of Winter)",
                    type: "month",
                    length: 30,
                    id: "ID_6a08a8aacb7b"
                },
                {
                    name: "Ches (The Claw of the Sunsets)",
                    type: "month",
                    length: 30,
                    id: "ID_db2a7bf97afa"
                },
                {
                    name: "Tarsakh (The Claw of Storms)",
                    type: "month",
                    length: 30,
                    id: "ID_6b48982b0bda"
                },
                {
                    name: "Greengrass",
                    type: "intercalary",
                    length: 1,
                    id: "ID_08790af92809"
                },
                {
                    name: "Mirtul (The Melting)",
                    type: "month",
                    length: 30,
                    id: "ID_b91b39f95a28"
                },
                {
                    name: "Kythorn (The Time of Flowers)",
                    type: "month",
                    length: 30,
                    id: "ID_f8e9585a2bf8"
                },
                {
                    name: "Flamerule (Summertide)",
                    type: "month",
                    length: 30,
                    id: "ID_fa895bdb38e9"
                },
                {
                    name: "Midsummer",
                    type: "intercalary",
                    length: 1,
                    id: "ID_a9181b5a683a"
                },
                {
                    name: "Eleasis (Highsun)",
                    type: "month",
                    length: 30,
                    id: "ID_1b1b1b287b0a"
                },
                {
                    name: "Eleint (The Fading)",
                    type: "month",
                    length: 30,
                    id: "ID_1aca5918993a"
                },
                {
                    name: "Highharvestide",
                    type: "intercalary",
                    length: 1,
                    id: "ID_a94a183b4b88"
                },
                {
                    name: "Marpenoth (Leaffall)",
                    type: "month",
                    length: 30,
                    id: "ID_58d97969eb79"
                },
                {
                    name: "Uktar (The Rotting)",
                    type: "month",
                    length: 30,
                    id: "ID_4b090b787b18"
                },
                {
                    name: "The Feast of the Moon",
                    type: "intercalary",
                    length: 1,
                    id: "ID_1b0ae8dbdb4a"
                },
                {
                    name: "Nightal (The Drawing Down)",
                    type: "month",
                    length: 30,
                    id: "ID_abb82afab80a"
                }
            ],
            moons: [
                {
                    name: "Selúne",
                    cycle: 30.4375,
                    offset: 13.9,
                    faceColor: "#ffffff",
                    shadowColor: "#000000",
                    id: "ID_48ea2a69a888"
                }
            ],
            leapDays: [
                {
                    name: "Shieldsmeet",
                    type: "leapday",
                    interval: [
                        {
                            ignore: false,
                            exclusive: false,
                            interval: 4
                        }
                    ],
                    offset: 0,
                    timespan: 9,
                    intercalary: false,
                    id: "ID_5b08faa88ada"
                }
            ],
            eras: []
        },
        current: {
            year: 1491,
            day: 1,
            month: 0
        },
        events: [
            {
                name: "Winter Solstice",
                description: null,
                id: "824588",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-events"
            },
            {
                name: "Vernal Equinox",
                description: null,
                id: "824589",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-events"
            },
            {
                name: "Summer Solstice",
                description: null,
                id: "824590",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-events"
            },
            {
                name: "Autumnal Equinox",
                description: null,
                id: "824591",
                note: null,
                date: {
                    day: null,
                    year: null,
                    month: null
                },
                category: "natural-events"
            },
            {
                name: "Shieldmeet",
                description:
                    "Shieldmeet was the equivalent of a leap year day in the Calendar of Harptos, occurring once every four years, adding a day after the festival of Midsummer and before Eleasis 1. Traditionally the day was used for fairs, bazaars, musical and theatrical performances, and tournaments of skill and magical ability. Nobles usually held court to hear the petitions of their people and to make or renew trade pacts, alliances, and agreements. Shieldmeet was known as Cinnaelos'Cor (also seen as Cinnaeloscor), \"the Day of Corellon's Peace\" in elvish and marked the end of an aeloulaev and the beginning of a new one in the elven Aryselmalyn calendar.",
                id: "824592",
                note: null,
                date: {
                    day: 2,
                    year: null,
                    month: 9
                },
                category: "festivals"
            },
            {
                name: "Feast of the Moon",
                description:
                    "The Feast of the Moon, or Moonfest, was an annual festival in the Calendar of Harptos, occurring between the final night of Uktar and the first day of Nightal. It was the last great festival of the calendar year.\n\nThe day traditionally marked the onset of winter. It was also a time to celebrate and honor the ancestors and the respected dead. On this day, folk blessed their ancestors' graves and performed the Ritual of Remembrance. People also gathered to tell stories of the deeds of their ancestors and of the gods until deep into the night, until they merged and became legend. This was a time to hear of past heroes, great treasures, and lost cities.\n\nIn FaerÃƒÂ»n, battles were typically fought between harvest-time and the coming of winter. This meant that most of the fighting usually occurred in the month of Uktar. The timing of the Feast of the MoonÃ¢â‚¬â€after recently slain soldiers had joined the ranks of the deadÃ¢â‚¬â€was thus practical, if sadly ironic.\n\nThe Heralds of FaerÃƒÂ»n had a number of special duties on the Feast of the Moon. Prime among these was to perform the Bloodsong ceremony, at which a Herald publicly recited the genealogies of each noble family in the area. In this way, the Heralds reaffirmed a noble family's traditional authority and status, as well as the respect accorded to them.\n\nPriests of a number of deities of various pantheons held rites, ceremonies, and festivals on the Feast of the Moon. Many, though not all, focused on remembering the dead in one way or another.",
                id: "824593",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 15
                },
                category: "festivals"
            },
            {
                name: "Highharvesttide",
                description:
                    'Highharvestide was an annual festival in the Calendar of Harptos, taking place between 30 Eleint and 1 Marpenoth. It was traditionally a feast to celebrate the harvest and the abundance of food, but also the time when those wishing to travel left on their journeys before winter set in.\n\nPreparations for the feast started as early as a tenday before, while preparing, cooking, and preserving the harvest for the cold winter months. Traditions varied from community to community, but examples of festive activity included food-related contests; races and challenges of skill and strength; receiving homemade sweets from the local clergy; and priests blessing larders, wine cellars, grain bins, and food preserves.\n\nThis day was often an important anniversary to various governments. Often, taxes and tithes came due, rulers held "open courts" to hear the concerns of their citizens, oaths were publicly renewed, troops received marching orders to new duty stations, and guilds met to confer on prices and rate changes for goods and services.\n\nAccording to tradition, dwarves only drank water and elves drank only dew on this day. However, these traditions began to fade in the 14th and 15th century DR.\n\nIt was said that children born on this day were favored by Tymora to have lifelong good luck but be smitten with wanderlust. Another legend was that human females born on this day had control over their reproductive system (i.e., got pregnant only when they wanted to) by force of will alone, and that they could instantly sense when they had been poisoned, either by ingestion or being bitten by a venomous creature for example.',
                id: "824594",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 12
                },
                category: "festivals"
            },
            {
                name: "Greengrass",
                description:
                    "Greengrass was a festival to welcome in the first day of spring in the Calendar of Harptos. It occured annually on a special day between Tarsakh 30 and Mirtul 1. Traditionally, the wealthier people brought out flowers to give to the less wealthy, who either wore them or spread them on the ground to encourage the deities to usher in the summer.",
                id: "824595",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 5
                },
                category: "festivals"
            },
            {
                name: "Midwinter",
                description:
                    "Midwinter (also known as Deadwinter Day) was a festival to mark the midpoint of winter in the Calendar of Harptos. It occured on a special day between Hammer 30 and Alturiak 1. Amongst nobles and monarchs it was known as Midwinter and was traditionally used to make or renew alliances, although the common people called it Deadwinter Day, a reference to the cold and hard times that remained before the spring.\n\nOn Midwinter Day the Red Fellowship of the Deity known as the Red Knight observes the Retreat. This solemn ceremony consists of an assembly wherein the clergy discuss the previous year's campaigns. Strategies are discussed, battles analyzed, and the accumulated lore integrated into the church's teachings.\n\nThe holiest day of the year for the Church of Shevarash is Midwinter Night, during which the Dark Court Slaughter is remembered. Inductions into the ranks of the clergy occur at this time. Each new cleric screams vows of vengeance into the night air and swears neither to laugh nor smile until the Spider Queen and her followers are no more.",
                id: "824596",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 1
                },
                category: "festivals"
            },
            {
                name: "Midsummer",
                description:
                    "Midsummer was a festival that celebrated love and music through feast. It occurred between Flamerule 30 and Eleasis 1 on the Calendar of Harptos. It was a time when love advanced, and it was said the deities themselves took a hand to ensure good weather. If bad weather was experienced on this night it was considered an extremely bad omen. Shieldmeet occurred the day after Midsummer on leap years.",
                id: "824597",
                note: null,
                date: {
                    day: 1,
                    year: null,
                    month: 9
                },
                category: "festivals"
            }
        ],
        id: null,
        categories: [
            {
                name: "Natural Events",
                id: "natural-events",
                color: "#2E7D32"
            },
            {
                name: "Festivals",
                id: "festivals",
                color: "#9b2c2c"
            }
        ]
    }
];
