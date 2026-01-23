# DESIGN CHOICES

## Database design

### User information

The _user_ is uniquely identified by its **username**, since we do not have an e-mail functionality.
The user has a **password** which is saved hashed and salted. Other basic info include the user's _full legal name_.

```
user = {
    String::username, [UNIQUE]
    String::hashed_psw,
    String::salt,
    String::name,
    String::surname
}
```

### Field information

A field can support one **sport type** between _football_, _volleyball_, and _basketball_. A facility which has more than one field should have a single
entry for each field. Time is local time.
```
field = {
    String::id, [UNIQUE]
    String::name,
    String::type,
    String::address,
    String::img_uri, [optional]
    String::description,
    Time::opening_time,
    Time::closing_time,
}
```
### Booking slots information

A booking slot for a field can only be created by the administrator. It has the following information:
```
booking_slot = {
    String::slot_id, [UNIQUE]
    String::field_id,
    Date::slot_date,
    Time::start_time,
    Time::end_time,
    String::booker [default = None]
}
```
It is clear that booking slots for the same field with overlapping hours are not legal.

By default a booking is created with no booker. If a booking has no booker it is considered free for booking. Once a user books the slot, the booker field can only be returned to None by the booker itself or the administrator.

It is responsibility of the admin to add slots according to their schedule. Times are local, and past slots cannot be booked even if free.

### Team information
Since players are not used anywhere else, and are not necessarily related to accounts on the platform, they are embedded in the team document.
```
team = {
    String::name, [UNIQUE]
    player[] = {
        String::name,
        String::surname,
        Int::jersey_num [optional]
    },
    Date::match_date,
    String::status, [default = upcoming]
    String::result [default = None]
    String::creator
}
```

### Matches information
Matches are created automatically by the system. Users can only create tournaments. Only the tournament creator can input the result of its matches.

```
match = {
    String::match_id, [UNIQUE]
    String::field_id,
    String::tournament_id,
    details = {
        String::information [optional]
        String[]::team_names,
        Date::match_date,
        String::status, [default = upcoming]
        String::result [default = None]
    }   
}
```

### Tournament information
```
tournament = {
    String::tournament_id, [UNIQUE]
    String::name
    String::sport_type,
    Date::start_date,
    Int::max_teams, [default = 2]
    String::creator
    details = {
        String::information,
        String[]::team_names,
        Match[]::matches
        standings = {
            String::status,
            score[] = {
                String::team,
                Int::score
            }
            String::winner [default = None]
            Date::finish_date [default = None]
        }
    }
}
```

## Session design

The session is implement through the use of **JWT**