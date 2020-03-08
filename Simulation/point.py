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
