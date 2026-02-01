# DESIGN CHOICES

## Database design

### User information

The _user_ is uniquely identified by its **username**, since we do not have an e-mail functionality.
The user has a **password** which is saved hashed and salted. Other basic info include the user's _full legal name_.

```
user = {
    username, [UNIQUE]
    name,
    surname,
    hashed_psw,
    salt,
}
```

### Field information

A field can support one **sport type** between _football_, _volleyball_, and _basketball_. A facility which has more than one field should have a single
entry for each field. Time is local time.
```
field = {
    _id, [UNIQUE]
    name,
    type,
    address,
    img_uri, [optional]
    description,
    opening_time,
    closing_time,
}
```
### Slots information

A booking slot for a field can only be created by the administrator. It has the following information:
```
slot = {
    _id, [UNIQUE]
    field_id,
    slot_date,
    start_time,
    end_time,
    booker [default = null]
}
```
A slot is considered free if the booker is null.

### Team information
Since players are not used anywhere else, and are not necessarily related to accounts on the platform, they are embedded in the team document.
```
team = {
    name, [UNIQUE]
    players: [
        player = {
            name,
            surname,
            jersey [optional]
        }
    ] 
    creator
}
```

### Matches information
Matches are created automatically by the system. Users can only create tournaments. Only the tournament creator can input the result of its matches. Once the results have been inputted, the status is automatically marked as played.

```
match = {
    tournament_id,
    information, [optional]
    teams: [],
    date,
    status, [default = upcoming]
    scores: []
}
```

### Tournament information
Standings are computed by analysing the played matches.
```
tournament = {
    _id, [UNIQUE]
    name,
    sport_type,
    start_date,
    max_teams,
    creator,
    details = {
        information,
        teams: [],
        matches: []
    },
    end_date
}
```

## Session design

The session is implement through the use of **JWT**