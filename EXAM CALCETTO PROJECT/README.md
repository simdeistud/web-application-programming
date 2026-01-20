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
    String::name,
    String::surname
}
```

### Field information

A field can support one **sport type** between _football_, _volleyball_, and _basketball_. A facility which has more than one field should have a single
entry for each field. Time is local time.
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
}
```
### Booking slots

A booking slot for a field can only be created by the administrator. It has the following information:
```
booking_slot = {
    String::slot_id,
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

## Session design

The session is implement through the use of **JWT**