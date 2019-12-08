import anki_vector
import sys

with anki_vector.Robot() as robot:
    robot.behavior.say_text(sys.argv[2])
