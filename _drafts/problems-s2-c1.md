---
title: Challenge Problems 1
author: Jackson Goerner & Ali Toosi
date: 2021-04-28 12:00:00 +1100
categories: [Challenge Problems]
tags: []
math: true
code: true
---

## Problem 1 - Sports Loans

### Statement

Andrew is head of the sports club, and manages the inventory.
Part of Andrew's job is loaning footballs to people, and collecting those footballs once they have been used.

At the start of the day, Andrew has \\(r\\) footballs in stock, and knows that \\(p+q\\) people will approach him over the course of the day. \\(p\\) people will request a football, while \\(q\\) people will return a football. What Andrew does not know is the order in which these people will approach him.

Of course, Andrew wants to be able to give a football to everyone who requests one, when they request one. So for example if the first \\(r+1\\) people want a football, Andrew can't give a football to the last person.

Andrew wants to know the probability that the above situation does **not** occur today, in other words the probability that every time someone requests a football, Andrew has one in stock.

TODO: Test cases and images.

### Input / Output

Input will consist of three space separated integers, \\(p, q\\) and \\(r\\), as defined in the problem statement.
Output should be a single number, the probability that Andrew will always be able to give a football to anyone who requests it. This number should have absolute error less than \\(10^{-8}\\).

### Solution

To handle the easy cases, if \\(p \leq r\\), then the probability is 1 (We can't possibly run out of footballs). If \\( p > r + q\\), then the probability is 0 (We can't possibly handle everyones request). We assume neither of these is the case for the following discussion.

Let's first view the problem through a different lens, to make the solution a bit more natural.
Imagine Andrew is a point on the 2D plane. Whenever a person approaches him to give him a football, he moves one unit in the positive \\(x\\)-axis, and whenever a person approaches him to request a football, he moves one unit in the positive \\(y\\)-axis.

![](/assets/img/posts/cp1/grid1.png)

We can think of this as the \\(x\\)-axis representing footballs returned, while the \\(y\\) axis represents footballs taken.
Since we start with \\(r\\) footballs, it might make sense to start Andrew at the position \\((r, 0)\\). Then, when Andrew is on the line \\(y = x\\), we know that Andrew has exactly 0 balls in inventory. Therefore we want to know the probability that Andrew never dips above this line (or equivalently, that Andrew never touches the line \\(y = x + 1\\)).

![](/assets/img/posts/cp1/grid2.png)

Since any ordering of the $p+q$ people is equally likely, we can simply count all possible distinct paths from \\((r, 0)\\) to \\((r+q, p)\\), and the proportion of these paths which sit below the line \\(y = x+1\\) is the probability we want. The number of all possible paths is \\({p+q \choose p} = {p+q \choose q}\\), since we can just pick the locations of the \\(p\\) (or \\(q\\)) people in our ordering.

Now, counting the number of paths that avoid the line is tough, but we can do something similar by finding a [bijection](https://www.wikiwand.com/en/Bijection) between invalid paths and some other collecion.

Rather than considering paths from \\((r, 0)\\) to \\((r+q, p)\\), what if we instead started from the same point, reflected on the line \\(y = x+1\\)? Then we'd be looking at paths from \\((-1, r+1)\\) to \\((r+q, p)\\). Note that every path between these two points needs to touch the line \\(y = x+1\\). Furthermore, we can turn each of these paths into an invalid path from \\((r, 0)\\) to \\((r+q, p)\\) in the following way:

1. Find the first intersection of the path with the line \\(y = x + 1\\) (Some intersection must exist).
2. Mirror the path along the line \\(y = x + 1\\) before this intersection.

![](/assets/img/posts/cp1/grid3.png)

Since \\((-1, r+1)\\) is the mirrored version of \\((r, 0)\\), all of these new paths are distinct paths from \\((r, 0)\\) to \\((r+q, p)\\). Furthermore, since the original paths hit the line, each of the these mirrored paths also hit the line and are therefore invalid. Hopefully it's also easy to see that every possible invalid path can be reached via this mirror method.

Therefore, the total number of invalid paths is equal to the total number of *any* of path between \\((-1, r+1)\\) and \\((r+q, p)\\). By the same argumentation as before, there are \\({(r+q+1) + (p-r-1) \choose r+q+1} = {p+q \choose p - r - 1}\\) possible paths.

Now that we know how many paths there are in total, and how many paths are invalid, we can calculate some probabilities.
The probability that Andrew does run into this situation (That we have a bad path) is:

$$
    P(\text{bad}) = \frac{p+q \choose p - r - 1}{p+q \choose p} = \frac{(p+q)!p!q!}{(p+q)!(p-r-1)!(q+r+1)!} = \frac{\prod^r_{i=0}p-i}{\prod^r_{i=0}q+i+1}.
$$

The probability the question asks for is then just \\(P(\text{good}) = 1 - P(\text{bad})\\). Note that the cancellation above is required to fit within precision and time limits, as we can't compute \\(p!\\) for large enough \\(p\\) within time.

<div class="code-tab">
    <button class="code-tablinks CHALLENGE-1-link" onclick="openCodeTab(event, 'CHALLENGE-1', 'CHALLENGE-1-Python')">Python</button>
    <button class="code-tablinks CHALLENGE-1-link" onclick="openCodeTab(event, 'CHALLENGE-1', 'CHALLENGE-1-CPP')">CPP</button>
</div>

<div id="CHALLENGE-1-Python" class="code-tabcontent CHALLENGE-1"  markdown="1">

```python
# Read 3 ints
p, q, r = list(map(int, input().split()))
if p <= r:
    print(1)
elif p > r + q:
    print(0)
else:
    p_bad = 1
    for i in range(r+1):
        p_bad *= (p-i) / (q+i+1)
    print(1-p_bad)
```

</div>

<div id="CHALLENGE-1-CPP" class="code-tabcontent CHALLENGE-1" markdown="1">

```cpp
#include <iostream>
#include <iomanip>

using namespace std;

int main() {

    // p, q can be large, use long long.
    long long p, q, r;

    cin >> p >> q >> r;

    if (p <= r) {
        cout << 1 << endl;
    } else if (p > r + q) {
        cout << 0 << endl;
    } else {
        double p_bad = 1;

        for (int i=0; i<= r; i++) {
            p_bad = p_bad * ((double)(p-i)) / ((double)(q+i+1));
        }

        cout << setprecision(10) << fixed << 1 - p_bad << endl;
    }

    return 0;
}
```

</div>

## Problem 2 - Optimal Farming

### Statement

Amy has just bought a farm in the outback, and wants to start selling tomatoes. Some of the crops in the farm are already tomatoes, but there are others she wants to get rid of and replace with tomatoes.

Amy has employed the help of Square Tomatoes Group™. Amy can pay the group $\\(s\\) to plant an \\(s \times s\\) grid of crops with tomatoes (It doesn't matter if the existing crop was tomatoes or not, and this grid can extend past the farm limits). Amy wants to minimise her cost to Square Tomatoes Group™ such that all crops are tomatoes.

TODO: Test cases and images.

### Input / Output

Input starts with two integers \\(1 \leq l, w \leq 30\\), the length and width of the farm, separated by space.
Input then contains \\(l\\) lines, each containing a string of \\(w\\) characters. Each of these characters represent a grid square in the farm. This square is a tomato crop if and only if the character printed is a `T`.

Output should be a single integer, the minimum Amy has to pay to fill her farm with tomato crops.

### Solution

We will generalise and compute \\(\text{cost}(x1, x2, y1, y2)\\), the cost of converting the rectangle \\([x1, x2), [y1, y2)\\) all to tomatoes. The question is asking us to compute \\(\text{cost}(0, w, 0, l)\\).

Note that we can always spend \\(\text{max}(x2-x1, y2-y1)\\) and cover the rectangle, by using a square that exceeds the bounds.
Also, note that if a collection of squares overlaps every column of the rectangle, then the cost must be at least \\(x2-x1\\), and similarly if every row of the rectangle is overlapped by a square, the minimum cost is \\(y2-y1\\).

With this in mind, suppose there was a cheaper selection of squares that convert this rectangle to tomatoes. Then from the logic above, there must be some column or row which is not touched by these squares (A column or row that is already all tomatoes). This column/row separates our rectangle in two, and so we can solve the subproblem of \\(\text{cost}\\) on each of these rectangles.

TODO: Complete and use better wording.

<div class="code-tab">
    <button class="code-tablinks CHALLENGE-2-link" onclick="openCodeTab(event, 'CHALLENGE-2', 'CHALLENGE-2-Python')">Python</button>
    <button class="code-tablinks CHALLENGE-2-link" onclick="openCodeTab(event, 'CHALLENGE-2', 'CHALLENGE-2-CPP')">CPP</button>
</div>

<div id="CHALLENGE-2-Python" class="code-tabcontent CHALLENGE-2"  markdown="1">

```python
import sys
sys.setrecursionlimit(10000)

l, w = list(map(int, input().split()))

grid = [input() for _ in range(l)]

# is the rectangle from x1 to x2, y1 to y2 all tomatoes? (RHS exclusive)
tomato_dp = [[[[None for _1 in range(31)] for _2 in range(31)] for _3 in range(31)] for _4 in range(31)]
def all_tomatoes(x1, x2, y1, y2):
    if tomato_dp[x1][x2][y1][y2] is not None:
        return tomato_dp[x1][x2][y1][y2]
    if x1 < x2 - 1:
        tomato_dp[x1][x2][y1][y2] = all_tomatoes(x1, x2-1, y1, y2) and all_tomatoes(x2-1, x2, y1, y2)
    elif y1 < y2 - 1:
        tomato_dp[x1][x2][y1][y2] = all_tomatoes(x1, x2, y1, y2-1) and all_tomatoes(x1, x2, y2-1, y2)
    else:
        # y2 = y1+1, x2 = x1+1.
        tomato_dp[x1][x2][y1][y2] = grid[x1][y1] == "T"
    return tomato_dp[x1][x2][y1][y2]

cost_dp = [[[[None for _1 in range(31)] for _2 in range(31)] for _3 in range(31)] for _4 in range(31)]
def cost(x1, x2, y1, y2):
    if cost_dp[x1][x2][y1][y2] is not None:
        return cost_dp[x1][x2][y1][y2]
    if x1 == x2 or y1 == y2:
        # Empty rectangle.
        return 0
    cur_min = max(x2-x1, y2-y1)
    # Otherwise, there is an empty row/column we can exclude. Simply solve this suproblem.
    for c in range(x1, x2):
        if all_tomatoes(c, c+1, y1, y2):
            cur_min = min(cost(x1, c, y1, y2) + cost(c+1, x2, y1, y2), cur_min)
    for r in range(y1, y2):
        if all_tomatoes(x1, x2, r, r+1):
            cur_min = min(cost(x1, x2, y1, r) + cost(x1, x2, r+1, y2), cur_min)
    cost_dp[x1][x2][y1][y2] = cur_min
    return cost_dp[x1][x2][y1][y2]

print(cost(0, w, 0, l))


```

</div>

<div id="CHALLENGE-2-CPP" class="code-tabcontent CHALLENGE-2" markdown="1">

```cpp
#include <iostream>
#include <string>

#define FOR(i,j,k) for(int i=j; i<k; i++)
#define MAX(a, b) (a > b) ? a : b
#define MIN(a, b) (a < b) ? a : b
#define MAXN 30

using namespace std;

int l, w;

const int UNKNOWN = -1;

int DP_TOMATOES[MAXN+1][MAXN+1][MAXN+1][MAXN+1];
int DP_COST[MAXN+1][MAXN+1][MAXN+1][MAXN+1];
string grid[MAXN+1];

// Is the rectangle [x1, x2), [y1, y2) all tomatoes?
bool tomatoes(int x1, int x2, int y1, int y2) {
    if (DP_TOMATOES[x1][x2][y1][y2] != UNKNOWN)
        return DP_TOMATOES[x1][x2][y1][y2];
    if (x1 < x2 - 1) {
        // Look at the column x=x2-1 separately
        DP_TOMATOES[x1][x2][y1][y2] = tomatoes(x1, x2-1, y1, y2) && tomatoes(x2-1, x2, y1, y2);
    } else if (y1 < y2 - 1) {
        // Look at the row y=y2-1 separately
        DP_TOMATOES[x1][x2][y1][y2] = tomatoes(x1, x2, y1, y2-1) && tomatoes(x1, x2, y2-1, y2);
    } else {
        // We are a 1x1.
        DP_TOMATOES[x1][x2][y1][y2] = grid[x1][y1] == 'T';
    }
    return DP_TOMATOES[x1][x2][y1][y2];
}

// What is the cost of making rectangle [x1, x2), [y1, y2) all tomatoes?
int cost(int x1, int x2, int y1, int y2) {
    if (DP_COST[x1][x2][y1][y2] != UNKNOWN)
        return DP_COST[x1][x2][y1][y2];
    if (x1 == x2 || y1 == y2)
        // Empty rectangle. Possible in the below recursion so just return 0.
        return 0;
    // We can always cover the rectangle by using a big square.
    int cur_min = MAX(x2-x1, y2-y1);
    FOR(c,x1,x2)
        if (tomatoes(c, c+1, y1, y2))
            // If this column is tomatoes, then we can try solving the two subproblems instead by removing the column.
            cur_min = MIN(
                cur_min,
                cost(x1, c, y1, y2) + cost(c+1, x2, y1, y2)
            );
    FOR(r,y1,y2)
        if (tomatoes(x1, x2, r, r+1))
            // If this row is tomatoes, then we can try solving the two subproblems instead by removing the row.
            cur_min = MIN(
                cur_min,
                cost(x1, x2, y1, r) + cost(x1, x2, r+1, y2)
            );
    DP_COST[x1][x2][y1][y2] = cur_min;
    return DP_COST[x1][x2][y1][y2];
}

int main() {

    cin >> l >> w;
    FOR(i,0,l) {
        cin >> grid[i];
    }

    FOR(x1,0,w+1)FOR(x2,0,w+1)FOR(y1,0,l+1)FOR(y2,0,l+1) {
        DP_TOMATOES[x1][x2][y1][y2] = UNKNOWN;
        DP_COST[x1][x2][y1][y2] = UNKNOWN;
    }

    cout << cost(0, w, 0, l) << endl;

    return 0;
}
```

</div>

## Problem 3 - Marble Track

### Statement

Alice has just recieved a new marble track for her birthday, as well as \\(n\\) shiny new marbles!
This marble track starts off with all \\(n\\) marbles in different pipes, but as the marbles move down the track, more and more pipes merge together, until all marbles meet at the bottom. The marbles can be modelled as a tree graph, where the root node is the endpoint of every marble, and each leaf is an entry-point for the marbles. This tree has \\(m\\) vertices and \\(m-1\\) edges.

Each marble has it's own texture, and so makes a distinctive sound when two marbles clank together.
Because of this, Alice wants to know where on the marble track she should focus if she weants to hear this sound. Alice also wants to know how many marbles with pass through this pipe.

### Input / Output

Input will start with one line containing 3 space-separated integers, \\(n, m, q\\). \\(n\\) is the number of marbles, \\(m\\) is the number of vertices in the tree representing the marble track, and \\(q\\) is the number of queries Alice will make.

Next follows \\(m-1\\) lines, each giving a distinct edge in the tree. It is guaranteed that the root node of the tree with be vertex 0, and the \\(n\\) marble entrance nodes will be \\(m-n\\) through to \\(m-1\\).

After this \\(q\\) lines follow. These represent the queries Alice has. Each line will contain two space-separated integers, \\(0 \leq a, b < n\\).

Output should consist of \\(q\\) lines. For each of the \\(q\\) corresponding lines in input, output two space-separated integers: the vertex at which these two marbles will meet and the number of marbles that will be there.

### Solution

TODO: fillin LCA + DP details.

## Actual Problem 3 - Juggling Trick

### Statement

Alice and her team of master jugglers are performing a trick. In this trick, every member of the team picks another member of the team - This will be the member they pass juggling balls to. Then, every member of the team grabs a different coloured juggling ball, and begins juggling.
Every 10 seconds, each member then passes all of their juggling balls to the person they chose. Team members are allowed to pick the same team member to pass juggling balls to, so you can end up with one person doing all the juggling!

Alice wants to know if at any point in the trick everyone will have the ball they started off with, and if so how long it will take to see this.

### Input / Output

Input will consist of 2 lines. The first line will contain a single integer \\(n\\), the number of members in Alice's team. The next line will contain \\(n\\) space-separated integers, the \\(i^{\text{th}}\\) integer \\(k\\) means that the \\(i^{\text{th}}\\) member of the team will pass the the \\(k^{\text{th}}\\) member.

Output should be a single integer. If there is no amount of time after which the jugglers find themselves back at the starting position, then output -1.
Otherwise, output the shortest amount of seconds we will have to wait.

### Solution

Note that if any member recieves two juggling balls, then our sequence can never return to how it was. Therefore everyone must recieve a single ball every 10 seconds. In other words, our \\(n\\) space-separated integers must be a permutation of the numbers \\(1\\) through to \\(n\\).
Note that in a permutation, way he multiple distinct cycles of different sizes (For example 1 passes to 3 passes to 7 passes to 4 passes to 1). Notably, each of the cycles repeat every \\(10k\\) seconds, where \\(k\\) is the length of the cycle.

Therefore, if we have cycles of length \\(k_1, k_2, \ldots k_a\\), then the first time the entire sequence will repeat must be the least common multiple of these values \\(k_1, k_2, \ldots k_a\\).

So our solution just needs to find each of these cycles, and count their length.
