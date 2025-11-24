# DESIGN CHOICES

## Database design

### User information

The user is uniquely identified by its **username**, since we do not have an e-mail functionality.
The user has a **password** which is saved hashed. Other basic info include the user's _full legal name_.

```
user = {
    String::username,
    String::hashed-psw,
    String::full-name
}
````