# DESIGN CHOICES

## Database design

### User information

The _user_ is uniquely identified by its **username**, since we do not have an e-mail functionality.
The user has a **password** which is saved hashed and salted. Other basic info include the user's _full legal name_.

```
user = {
    String::username,
    String::hashed_psw,
    String::salt,
    String::full_name
}
```

### Field information

A field can support one **sport type** between _football_, _volleyball_, and _basketball_. A facility which has more than one field should have a single
entry for each field. Each field has a list of _N_ time slots that can be allocated each day, and a list of _M_ bookings.
```
field = {
    String::id,
    String::name,
    String::type,
    String::address,
    String::img_uri, [optional]
    String::description,
    Time::opening_time,
    Time::closing_time,
    Timeslot[]::timeslot = {
        String::starting_hour,
        String::ending_hour,
    }
    Booking[]::booking
}
```

### Booking information

A **booking** is always included inside a _field_ object, thus there is no need to identify them separately. A _booker_ is the username of the user who booked the field. The booking refers to the _i-th_ slot provided by the field on a given date.
```
booking = {
    String::booker,
    Date::date,
    int::slot
}
```

## Session design

The session is implement through the use of **JWT**