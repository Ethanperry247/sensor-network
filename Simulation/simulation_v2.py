import random # To generate random points.
from point import * # Custom point and edge classes.
from logger import Logger # Import logging capabilities.
import networkx as nx # Graph generating utility.
import matplotlib.pyplot as plt # Graphing utility.

# Create a new logger.
logger = Logger("example.csv")

# Create a new graph (will be drawn).
G = nx.Graph()

# Number of nodes and the limits of their location.
NUM_NODES = 50
GRAPH_SIZE = 400


# Set the max radius for the simulation.
D: float = 60
R: float = D/2

# Create a set of vertices to be put into our steiner tree.
point_set: Point = set()

# Relay nodes
relay_node_set: Point = set()

# Generate 100 random nodes.
for i in range(0, NUM_NODES):
    x = random.randint(0, GRAPH_SIZE)
    y = random.randint(0, GRAPH_SIZE)
    # Add a point at a random location, and assign it an ID.
    point_set.add(Point(x, y, i))
    # Add nodes to the graph G.
    G.add_node(i,pos=(x,y))

# Draw the graph of nodes with edges.
pos = nx.get_node_attributes(G,'pos')
# Draw G without any edges.
nx.draw(G, pos, node_size=10, with_labels=True)
plt.show()

# Create a duplicate of graph G to edges to.
Edge_G = G

# Create a duplicate of graph G to demonstrate the minimum spanning tree.
Minimum_Edge_G = G

# Since point set will become empty when creating the edges, this is a duplicate.
reserve_point_set: Point = set(point_set)

# In the display of the final graph with relay nodes, this list will be used.
final_list = list(point_set)

# Initialize an empty list of edges.
# Because all points are unique, this should contain all unique values.
edge_set: Edge = []

# Initialize an empty steiner tree.
steiner_tree = []

# To be used by the recursive family finding function get_family().

# Grabs the passed in point and all points connected to that point.
def get_family(point: Point):
    family = set()
    recur(point, family)
    family.add(point)
    return family

# The recursive implementation for the get_family method.
# Grabs the corresponding point to the passed in point, adds it to a list,
# then recurs on that point.
def recur(point: Point, family):
    if (point in family):
        return
    else:
        family.add(point)
    for edge in tree_edges:
        if (edge.get_corresponding_point(point) is not None):
            recur(edge.get_corresponding_point(point), family)


# Checks if the second point is within the family or group of the first point.
# If it is, it returns true.
def check_for_loop(first, second):
    first_family = get_family(first)
    if (second in first_family):
        return True
    else:
        return False


# Fill the edge set.
# Loop until point set is empty.
while (bool(point_set)):
    comparison_point = point_set.pop() # Grab a point in the list.

    # Print out all available points if desired.
    # print(f'Point: {str(comparison_point)}')

    logger.writeToCSV(comparison_point.x, comparison_point.y) # Write the point to a csv file for graphing purposes.

    # Generate every possible edge between all points. 
    # Will theoretically generate n^2 edges where n is number of points.
    for point in point_set:
        edge_set.append(Edge(comparison_point, point))

# Sort the list of all edges from least to greatest.
edge_set.sort(key=Edge.return_distance)

##### Print out all available edges if desired. #####
# print("\n\n\nAll possible edges: ")
# print(f"Size: {len(edge_set)}")
# Print out all edges.
# for edge in edge_set:
#     print(f'{str(edge)}')

# To be filled with the edges of the minimum spanning tree.
tree_edges: Edge = set()

def generate_minimum_spanning_tree():
    print("Generating minimum spanning tree...")
    for edge in edge_set:
        # First check if our point set is full. If it is, we are done constructing the minimum spanning tree.
        if (point_set == reserve_point_set):
            break

        if(not check_for_loop(edge.get_first_point(), edge.get_second_point())):
            tree_edges.add(edge)
            Minimum_Edge_G.add_edge(edge.get_first_point().ID, edge.get_second_point().ID)
    print("Found Minimum Spanning Tree")

generate_minimum_spanning_tree()

# Creates a list of the MST edges, then adds all of those elements to the graph to be drawn.
tree_edge_list = list(tree_edges)
# Sorts the MST edges.
tree_edge_list.sort(key=Edge.return_distance)
for edge in tree_edge_list:
    Minimum_Edge_G.add_edge(edge.get_first_point().ID, edge.get_second_point().ID)


# Draw the graph of nodes with edges.
pos = nx.get_node_attributes(Minimum_Edge_G,'pos')
# Control the size of the nodes using node_size.
nx.draw(Minimum_Edge_G, pos, node_size=10)
plt.show()

# To be filled with all required relay nodes.
relay_point_list = []

# Create a new graph (will be drawn).
final_graph = nx.Graph()

# This method takes in an edge, searches the list of edges, and returns the corresponding edge to one vertex.
def get_corresponding_edge(edge):
    for second_edge in tree_edge_list:
        if (edge != second_edge):
            if (edge.second_point == second_edge.first_point):
                return second_edge
    return None
    
# This method finds every two connected edges and finds a relay node which connects them if applicable.
def generate_three_stars():
    for first_edge in tree_edge_list:
        # tree_edge_list.remove(edge)
        second_edge = get_corresponding_edge(first_edge)
        if (second_edge is not None):
            if (first_edge.return_distance() > R and second_edge.return_distance() > R):
                relay_point = first_edge.find_three_star_relay(second_edge.second_point)
                final_graph.add_node(relay_point.ID,pos=(relay_point.x,relay_point.y))
                relay_point_list.append(relay_point.ID)

# Generates relay nodes for three stars where they are applicable.
generate_three_stars()

def generate_relay_nodes():
    for edge in tree_edge_list:
        if (edge.return_distance() > R):
            relay_points = edge.split_points(R)
            print(str(relay_points))
            for relay_point in relay_points:
                final_graph.add_node(relay_point.ID,pos=(relay_point.x,relay_point.y))
                relay_point_list.append(relay_point.ID)

# Generates relay nodes where they are applicable.
generate_relay_nodes()

# Will be populated by sensor nodes.
sensor_point_list = []

# Adds all sensor nodes to the final graph printout.
for point in final_list:
    final_graph.add_node(point.ID,pos=(point.x,point.y))
    sensor_point_list.append(point.ID)

# Adds all edges to the final graph printout.
for edge in tree_edge_list:
    final_graph.add_edge(edge.get_first_point().ID, edge.get_second_point().ID)
    pass

# Draw the additional relay nodes in red.
pos = nx.get_node_attributes(final_graph,'pos')

# Draw the sensor nodes to the screen.
nx.draw(final_graph, pos, node_size=10)

# Draw the relay nodes to the screen.
nx.draw(final_graph, pos,
                       nodelist=relay_point_list,
                       node_color='r',
                       node_size=10,
                       alpha=0.8)
plt.show()