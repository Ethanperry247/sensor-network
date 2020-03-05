import random # To generate random points.
from point import * # Custom point and edge classes.

# Set the max radius for the simulation.
D: float = 30
R: float = D/2

# Create a set of vertices to be put into our steiner tree.
point_set: Point = set()

# Relay nodes
relay_node_set: Point = set()

# Generate 100 random nodes.
for i in range(0, 100):
    x = random.randint(0, 400)
    y = random.randint(0, 400)
    point_set.add(Point(x, y))


# Initialize an empty list of edges.
# Because all points are unique, this should contain all unique values.
edge_set: Edge = []

# Initialize an empty steiner tree.
steiner_tree = []

# Fill the edge set.
# Loop until point set is empty.
while (bool(point_set)):
    comparison_point = point_set.pop()
    print(f'Point: {str(comparison_point)}')

    for point in point_set:
        edge_set.append(Edge(comparison_point, point))

# Sort the list of all edges.
edge_set.sort(key=Edge.return_distance, reverse=True)

while (bool(edge_set)):
    edge = edge_set.pop()
    if (edge.distance <= R):
        steiner_tree.append(edge)
    else:   # If a steiner edge is longer than the radius, make a new steiner point half way in between, and create two new edges.
        new_steiner_point = edge.find_half_way_point()
        edge_set.append(Edge(edge.first_point, new_steiner_point))
        edge_set.append(Edge(new_steiner_point, edge.second_point))
        relay_node_set.add(new_steiner_point)

# Print out all relay nodes.
while(bool(relay_node_set)):
    relay_node = relay_node_set.pop()
    print(str(relay_node))

print(len(relay_node_set))







