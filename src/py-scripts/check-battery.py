import anki_vector

with anki_vector.Robot() as robot:
    battery_state = robot.get_battery_state()

    if battery_state:
        print("Robot battery voltage: {0}".format(battery_state.battery_volts))
        print("Robot battery Level: {0}".format(battery_state.battery_level))
        print("Robot battery is charging: {0}".format(battery_state.is_charging))
        print("Robot is on charger platform: {0}".format(battery_state.is_on_charger_platform))
        print("Robot's suggested charger time: {0}".format(battery_state.suggested_charger_sec))
