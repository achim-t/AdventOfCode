import numpy as np
from scipy.optimize import least_squares

with open('input.txt', 'r') as f:
    hailstones = []
    for line in f:
        pos_str, vel_str = line.strip().split('@')
        pos = np.array(list(map(int, pos_str.split(', '))))
        vel = np.array(list(map(int, vel_str.split(', '))))
        hailstones.append({'pos': pos, 'vel': vel})
n = len(hailstones)

A = np.zeros((n, 6))
b = np.zeros(n)
for i, h in enumerate(hailstones):
    A[i, :3] = h.vx
    A[i, 3:] = -1
    b[i] = np.dot(h.vx, h.px)

# Solve the system of equations
x = np.linalg.lstsq(A, b, rcond=None)[0]

# The position and velocity of the rock are given by the first 3 and last 3 elements of x, respectively
rock_px = x[:3]
rock_vx = x[3:]


print(f"Position: {rock_px}, Velocity: {rock_vx}")