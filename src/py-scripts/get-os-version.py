import anki_vector
with anki_vector.Robot() as robot:
    version_state = robot.get_version_state()
    if version_state:
        print("Robot os_version: {0}".format(version_state.os_version))
        print("Robot engine_build_id: {0}".format(version_state.engine_build_id))


