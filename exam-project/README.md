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
    ID::_id, [UNIQUE]
    String::name,
    String::type,
    String::address,
    String::img_uri, [optional]
    String::description,
    Time::opening_time,
    Time::closing_time,
}
```
### Slots information

A booking slot for a field can only be created by the administrator. It has the following information:
```
slot = {
    ID::_id, [UNIQUE]
    ID::field_id,
    Date::slot_date,
    Time::start_time,
    Time::end_time,
}
```

### Bookings information

```
booking = {
    ID::_id, [UNIQUE]
    ID::slot_id,
    String::booker_name [default = None]
}
```

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
    String::creator
}
```

### Matches information
Matches are created automatically by the system. Users can only create tournaments. Only the tournament creator can input the result of its matches. Once the results have been inputted, the status is automatically marked as played.

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
        results[] = {
            String::team_name,
            Int::score
        } [default = None]
    }   
}
```

### Tournament information
Standings are computed by analysing the played matches.
```
tournament = {
    String::tournament_id, [UNIQUE]
    String::name
    String::sport_type,
    Date::start_date,
    Int::max_teams,
    String::creator
    details = {
        String::information,
        String[]::team_names,
        String[]::matches
    }
}
```

## Session design

The session is implement through the use of **JWT**