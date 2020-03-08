import random # To generate random points.
from point import * # Custom point and edge classes.
from logger import Logger # Import logging capabilities.
import networkx as nx
import matplotlib.pyplot as plt

# Create a new logger.
logger = Logger("example.csv")

# Create a new graph (will be drawn).
G = nx.Graph()

# Number of nodes and the limits of their location.
NUM_NODES = 100
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

def get_family(point: Point):
    family = set()
    recur(point, family)
    family.add(point)
    return family

def recur(point: Point, family):
    if (point in family):
        return
    else:
        family.add(point)
    for edge in tree_edges:
        if (edge.get_corresponding_point(point) is not None):
            recur(edge.get_corresponding_point(point), family)


def check_for_loop(first, second):
    first_family = get_family(first)
    if (second in first_family):
        return True
    else:
        return False


# Fill the edge set.
# Loop until point set is empty.
while (bool(point_set)):
    comparison_point = point_set.pop()
    # Print out all available points if desired.
    # print(f'Point: {str(comparison_point)}')
    logger.writeToCSV(comparison_point.x, comparison_point.y)

    for point in point_set:
        # if (point.find_distance_from(comparison_point) < 2*R):
        edge_set.append(Edge(comparison_point, point))
            # Edge_G.add_edge(comparison_point.ID, point.ID)

# Draw the graph of nodes with edges.
# pos = nx.get_node_attributes(Edge_G,'pos')
# Control the size of the nodes using node_size.
# nx.draw(Edge_G, pos, node_size=10, with_labels=True)
# plt.show()

# Sort the list of all edges from least to greatest.
edge_set.sort(key=Edge.return_distance)

# Print out all available edges if desired.
# print("\n\n\nAll possible edges: ")
# print(f"Size: {len(edge_set)}")
# Print out all edges.
# for edge in edge_set:
#     print(f'{str(edge)}')

tree_edges: Edge = set()

long_edge_list = []

print("Generating minimum spanning tree...")
for edge in edge_set:
    # First check if our point set is full. If it is, we are done constructing the minimum spanning tree.
    if (point_set == reserve_point_set):
        print("Found Minimum Spanning Tree")
        break

    if(check_for_loop(edge.get_first_point(), edge.get_second_point())):
        # print("Avoided loop.")
        pass
    else:
        tree_edges.add(edge)
        Minimum_Edge_G.add_edge(edge.get_first_point().ID, edge.get_second_point().ID)
        # # Draw the graph of nodes with edges.
        # pos = nx.get_node_attributes(Minimum_Edge_G,'pos')
        # # Control the size of the nodes using node_size.
        # nx.draw(Minimum_Edge_G, pos, node_size=10, with_labels=True)
        # plt.show()
        # point_set.add(edge.get_first_point())
        # point_set.add(edge.get_second_point())

##### Print out all available tree edges if desired #####
tree_edge_list = list(tree_edges)
tree_edge_list.sort(key=Edge.return_distance)
# print("\n\n\nMinimum Spanning Tree Edges: ")
# print(f"Size: {len(tree_edge_list)}")
for edge in tree_edge_list:
    # print(f'{str(edge)}')
    Minimum_Edge_G.add_edge(edge.get_first_point().ID, edge.get_second_point().ID)

# Draw the graph of nodes with edges.
pos = nx.get_node_attributes(Minimum_Edge_G,'pos')
# Control the size of the nodes using node_size.
nx.draw(Minimum_Edge_G, pos, node_size=10)
plt.show()

new_point_list = []

# Create a new graph (will be drawn).
final_graph = nx.Graph()

for edge in tree_edge_list:
    if (edge.return_distance() > R):
        new_point = edge.find_half_way_point()
        print(str(new_point))
        final_graph.add_node(new_point.ID,pos=(new_point.x,new_point.y))
        new_point_list.append(new_point.ID)

original_point_list = []

for point in final_list:
    final_graph.add_node(point.ID,pos=(point.x,point.y))
    original_point_list.append(point.ID)

for edge in tree_edge_list:
    final_graph.add_edge(edge.get_first_point().ID, edge.get_second_point().ID)
    pass

# Draw the additional relay nodes in red.
pos = nx.get_node_attributes(final_graph,'pos')

# Draw the nodes to the screen.
nx.draw(final_graph, pos, node_size=10)

nx.draw(final_graph, pos,
                       nodelist=new_point_list,
                       node_color='r',
                       node_size=10,
                       alpha=0.8)
plt.show()


