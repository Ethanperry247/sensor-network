import math

class Point:

    def __init__(self, x, y, ID, node_type='S'):
        super().__init__()
        self.x = x
        self.y = y
        self.ID = ID
        self.node_type = node_type

    def find_distance_from(self, point) -> float:
        return math.sqrt(pow(self.x - point.x, 2) + pow(self.y - point.y, 2))

    def __str__(self):
        return f'[X = {self.x}, Y = {self.y}, Type = {self.node_type}]'

class Edge:

    def __init__(self, first_point, second_point):
        super().__init__()
        self.first_point: Point = first_point
        self.second_point: Point = second_point
        self.distance: float = first_point.find_distance_from(second_point)

    def __str__(self):
        return f'[First Point = {str(self.first_point)}, Second Point = {str(self.second_point)}, Distance = {self.distance}]'

    def return_distance(self):
        return self.distance

    def get_first_point(self):
        return self.first_point

    def get_second_point(self):
        return self.second_point

    def get_corresponding_point(self, point: Point):
        if (point == self.first_point):
            return self.second_point
        elif (point == self.second_point):
            return self.first_point
        else:
            return None

    def find_three_star_relay(self, third_point: Point):

        mid_point = self.find_half_way_point()
        mid_edge = Edge(mid_point, third_point)
        center_point = mid_edge.find_half_way_point()

        return center_point

    def find_half_way_point(self):
        # Find the X half way in between the two points.
        if (self.first_point.x <= self.second_point.x):
            x = self.first_point.x + (self.second_point.x - self.first_point.x)//2
        else:
            x = self.first_point.x - (self.first_point.x - self.second_point.x)//2
        
        # Find the Y half way in between the two points.
        if (self.first_point.y <= self.second_point.y):
            y = self.first_point.y + (self.second_point.y - self.first_point.y)//2
        else:
            y = self.first_point.y - (self.first_point.y - self.second_point.y)//2

        return Point(x, y, int(x*y))

    def split_points(self, radius) -> set():

        # First get the number of radii away the two points are.
        num_ranges: int = int(self.distance//(radius*2) + 1)

        # Create an empty set of points--to be the return for the method.
        relay_nodes = set()

        # Create an empty array for the x components and y components to be used when creating new points.
        x_components = []
        y_components = []

        # Find the X and Y distance between the two points.
        # Then, divide by the number of relay node ranges to find the x and y length between each relay node.
        x_distance = abs(self.first_point.x - self.second_point.x)/(num_ranges+1)
        y_distance = abs(self.first_point.y - self.second_point.y)/(num_ranges+1)

        

        # Find the X and Y components of the relays splitting the two nodes.
        # There are four cases, each depending on whether the X and Y locations of the first node are greater or less than that of the second node.
        if (self.first_point.x <= self.second_point.x):
            if (self.first_point.y <= self.second_point.y):
                for i in range(1, num_ranges + 1):
                    y_components.append(self.first_point.y+y_distance*i)
                    x_components.append(self.first_point.x+x_distance*i)
            else:
                for i in range(1, num_ranges + 1):
                    x_components.append(self.first_point.x+x_distance*i)
                    y_components.append(self.second_point.y+y_distance*i)
                y_components.reverse() # The purpose of the reversing is to properly align the X and Y component arrays so that nodes are placed correctly.
        else:
            if (self.first_point.y <= self.second_point.y):
                for i in range(1, num_ranges + 1):
                    x_components.append(self.second_point.x+x_distance*i)
                    y_components.append(self.first_point.y+y_distance*i)
                y_components.reverse()
            else:
                for i in range(1, num_ranges + 1):
                    x_components.append(self.second_point.x+x_distance*i)
                    y_components.append(self.second_point.y+y_distance*i)

        # Create all of the relay nodes based on the calculated X and Y components.
        for i in range(0, num_ranges):
            relay_nodes.add(Point(x_components[i], y_components[i], int(x_components[i] * y_components[i]), node_type='R'))

        return relay_nodes
