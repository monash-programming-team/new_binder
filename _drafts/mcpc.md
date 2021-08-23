---
title: MCPC Solutions
author: Jackson Goerner
date: 2021-04-28 12:00:00 +1100
categories: [Contests]
tags: []
math: true
code: true
---

# Government Divided - Part 1

<div class="unlock" markdown="1">
  <button class="button_unlock hint">Hint 1</button>

<div class="show" markdown="1">

**Hint 1**

Divying up \\(N\\) work into equal integer portions for \\(d\\) subordinates has only 1 (or 0) solutions, and depends on whether \\(d\\) divides \\(N\\).

</div>

</div>

<div class="unlock" markdown="1">

<button class="button_unlock hint">Hint 2</button>

<div class="show" markdown="1">

**Hint 2**

The total number of distinct divisions is exactly the number of factors of \\(N\\), including itself and 1.
So you need a fast way to find the *prime* factors of any number less than \\(10^7\\), and then a nice way to count the total number of factors with this information alone.

</div>

</div>

<div class="unlock" markdown="1">

<button class="button_unlock solution">Solution</button>

<div class="show" markdown="1">

**Solution**

The total number of distinct divisions is exactly the number of factors of \\(N\\), including itself and 1.
Provided you knew the prime factors of a number (for example \\(12 = 2^2 \times 3^1\\)), then we can calculate the total number of factors by multiplying all prime exponents together (after adding 1 to each).

So for \\(12\\): Total number of factors = \\((2 + 1) \times (1 + 1) = 6\\).
This is because any factor of 12 must have a prime factorization that looks like \\(2^a \times 3^b\\), with \\(0 \leq a \leq 2\\) and \\(0 \leq b \leq 1\\).

To find the prime factors 1000 numbers fast, we can use [Eratosthenes sieve](https://www.wikiwand.com/en/Sieve_of_Eratosthenes).

<div class="code-tab">
    <button class="code-tablinks CONTEST-GOV-1-link" onclick="openCodeTab(event, 'CONTEST-GOV-1', 'CONTEST-GOV-1-Python')">Python</button>
    <button class="code-tablinks CONTEST-GOV-1-link" onclick="openCodeTab(event, 'CONTEST-GOV-1', 'CONTEST-GOV-1-CPP')">CPP</button>
</div>

<div id="CONTEST-GOV-1-Python" class="code-tabcontent CONTEST-GOV-1"  markdown="1">

```python
T = int(input())

fac = [0] * 10000000
pr = []

# This isn't the sieve per se, but finds a prime factor for each number.
for i in range(2, 10000001):
    if fac[i] == 0:
        fac[i] = i
        pr.append(i)
    for p in pr:
        if p > fac[i] or i * p > 10000000:
            break
        fac[i * p] = p

def fast_factors(n):
    res = []
    while n > 1:
        f = fac[n]
        n //= f
        if len(res) == 0 or res[-1][0] != f:
            res.append([f, 1])
        else:
            res[-1][1] += 1
    return res

for _ in range(T):
    n = int(input())
    facs = fast_factors(n)
    ways = 1
    for f, c in facs:
        ways *= c + 1
    print(ways)
```

</div>

<div id="CONTEST-GOV-1-CPP" class="code-tabcontent CONTEST-GOV-1" markdown="1">

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <queue>
#include <map>

using namespace std;

typedef long long ll;
typedef vector<ll> vll;
typedef pair<ll, ll> pl;
typedef vector<pl> vpl;

#define MAX_N 10000000

ll T, n_i;
vll fac, pr;
// This isn't the sieve per se, but finds a prime factor for each number.
void fast_sieve(ll n) {
    fac.assign(n+1, 0);
    for (ll i=2; i<=n; i++) {
        if (fac[i] == 0) fac[i] = i, pr.push_back(i);
        for (ll p: pr) if (p > fac[i] || i * p > n) break; else fac[i * p] = p;
    }
}

vpl fast_factors(ll n) {
    vpl res;
    while (n > 1) {
        ll f = fac[n];
        n /= f;
        if (res.size() == 0 || res[res.size()-1].first != f) {
            res.push_back({f, 1});
        } else {
            res[res.size() - 1].second++;
        }
    }
    return res;
}

int main() {

    cin >> T;
    fast_sieve(MAX_N);

    for (int i=0; i<T; i++) {
        cin >> n_i;
        vpl factors = fast_factors(n_i);
        ll ways = 1;
        for (pl x: factors) {
            ways *= x.second + 1;
        }
        cout << ways << endl;
    }

    return 0;
}
```

</div>

</div>

</div>

# Government Divided - Part 2

<div class="unlock" markdown="1">
  <button class="button_unlock hint">Hint 1</button>

<div class="show" markdown="1">

**Hint 1**

The main restriction given is itself a very strong hint. Why is the solution for \\(k-1\\) restricted, and not our solution?
What is the significance of \\(k-1\\)? And how does it relate to our problem.

</div>

</div>

<div class="unlock" markdown="1">

<button class="button_unlock hint">Hint 2</button>

<div class="show" markdown="1">

**Hint 2**

As the first hint suggests, a recursive definition of the solution is preferrable.

Namely, we want to compute \\(f_{N, k}\\), the total number of distinct trees that divy up \\(N\\) work in \\(k\\) levels.
If we know \\(f_{a, k-1}\\) where \\(a\\) is any factor of \\(N\\), then how can we use this to compute \\(f_{N, k}\\)? Don't worry about the modulo portion for now.

</div>

</div>

<div class="unlock" markdown="1">

<button class="button_unlock solution">Solution</button>

<div class="show" markdown="1">

**Solution**

Just as with the first part of this question, knowledge of the prime factors of a number \\(N\\) is important here.
However, rather than using Eratosthenes Sieve, because we are only dealing with a single number we can just find the primes in \\(\sqrt{N}\\) time by brute forcing possible divisors.

Let's let \\(f_{N, k}\\) be the answer we are looking for.

Notice that for \\(k=1\\), we've already solved this problem. \\(f_{N, 1}\\) is just the total number of factors of \\(N\\).

Now, similar to an inductive proof, let's assume that we know \\(f_{N, k}\\) for all \\(N > 0\\) and \\(k < d\\), for some constant \\(d\\). How can we then compute the answer for \\(k = d\\)?

We can tackle this by looking at the top level of our \\(d\\) length tree. Just as in the \\(k=1\\) case, we need to split our \\(N\\) into a factor of \\(N\\) pieces. Let's say we break it up into \\(c\\) pieces, where \\(c\\) divides \\(N\\).

Each of these pieces then has \\(k-1\\) levels of dividing to go, and so it can be useful to know that there are \\(f_{N/c, k-1}\\) distinct ways to then further divide each subtree.

If we cared about the relative order of the trees, then the answer would be just \\(c \times f_{N/c, k-1}\\).
But since we only consider trees distinct up to isomorphism, we need a different way to count them.

Let's say that \\(f_{N/c, k-1}\\) is 3, in other words there are 3 distinct trees that divide \\(N/c\\) work over \\(k-1\\) steps. Let's call them type X, Y, Z.

So for \\(f_{N, k}\\), the only distinct trees with a \\(c\\) division to begin with, are those which have different amounts of types X, Y and Z.

For example, any tree which splits into \\(c\\) parts, and then of these \\(c\\) parts there are 2 Xs, 3 Ys, and 7 Zs, must isomorphic to any other tree with the same amount of X, Y and Z.

(**IMAGE**)

Therefore, we need to count how many different ways we can divy up our \\(c\\) parts into X Y and Z types.

We can achieve this with [stars and bars](https://brilliant.org/wiki/integer-equations-star-and-bars/), a very useful combinatorial concept that allows you to count combinations with repetition. Using the terminology of the link given, we want to place the \\(c\\) indistinguisable balls (indistinguishable subtree positions) into one of the 3 urns (X Y or Z).

And so we have:

$$
f_{N, k} = \sum_{c} {c + f_{N/c, k-1} - 1 \choose f_{N/c, k-1} - 1}
$$

So we can compute this with dynamic programming.

Any number less than or equal to \\(10^14\\) has at most ~\\(10000\\) factors. (You can compute this yourself, with a smart algorithm, or just notice that you can't have that many small prime factors before your number becomes quite large).

Since each number has at most \\(10^4\\) factors, We only need to compute \\(10^4 \times k\\) different values of \\(f_{a, b}\\). Each of these computations requires \\(10^4\\) recursive calls at most (but almost all will be much smaller), giving an overall complexity of \\(10^8 \times k\\) at extreme worst, however the restriction means that for \\(N\\) large, \\(k\\) is very small, and vice versa.

Now to deal with the modulo and restriction parts. Notice that because of the restriction on \\(f_{N, k-1}\\), all recursive calls will not need to worry about modulo. In particular, anything we pass into \\(a \choose b\\) will not have \\(b > 10000\\).
The result of \\(a \choose b\\) however does need to be modulo'd, since the final result, \\(f_{N, k}\\), can exceed \\(10^9+7\\).

There's some minor tricks for ensuring that computing \\(a \choose b\\) is fast, but otherwise the actual math isn't too complicated.

<div class="code-tab">
    <button class="code-tablinks CONTEST-GOV-2-link" onclick="openCodeTab(event, 'CONTEST-GOV-2', 'CONTEST-GOV-2-Python')">Python</button>
    <button class="code-tablinks CONTEST-GOV-2-link" onclick="openCodeTab(event, 'CONTEST-GOV-2', 'CONTEST-GOV-2-CPP')">CPP</button>
</div>

<div id="CONTEST-GOV-2-Python" class="code-tabcontent CONTEST-GOV-2"  markdown="1">

```python
MAX_FACT = 10000
MAX_K = 30
MOD = 1000000007

fact = [-1] * (MAX_FACT + 1)

fact[0] = 1
fact[1] = 1
for i in range(2, MAX_FACT + 1):
    fact[i] = (fact[i - 1] * i) % MOD

def expmod(a, b):
  res=1
  a %= MOD
  while b:
    if (b&1):
      res=(res*a)%MOD
    b //= 2
    a=(a*a)%MOD
  return res

def inv(a):
    return expmod(a, MOD - 2)

def nCk(a, b):
    if b > MAX_FACT:
        raise ValueError("Does not fit problem description.")
    # b (num distinct - 1) is always quite small <= 10000.
    if a > MAX_FACT:
        res = 1
        for i in range(b):
            res *= a - i
            res %= MOD
        res = res * fact[b] % MOD
        return res
    return fact[a] * inv(fact[b]) * inv(fact[a-b]) % MOD

def slow_factors(a):
    res = []
    i = 2
    while i * i <= a:
        if (a % i == 0):
            res.append([i, 0])
            while (a % i == 0):
                a //= i
                res[-1][1] += 1
        i += 1
    if (a > 1):
        res.append([a, 1])
    return res

from collections import defaultdict
DP = [defaultdict(lambda: -1) for _ in range(MAX_K+1)]

def solve(fac_counts, n, k):
    if DP[k][n] != -1:
        return DP[k][n]
    if k == 0:
        DP[k][n] = 1
        return DP[k][n]
    total = 0
    # Try any possible selection of fac_count elements.
    counters = [0] * len(fac_counts)
    new_counts = [0] * len(fac_counts)
    while counters[0] <= fac_counts[0][1]:
        cur = n
        for x in range(len(counters)):
            if counters[x] > 0:
                cur //= fac_counts[x][0] * counters[x]
            new_counts[x] = [fac_counts[x][0], fac_counts[x][1] - counters[x]]
        distinct = solve(new_counts, cur, k-1)
        # Number of distinct = n // cur stars, distinct - 1 bars.
        if distinct == 1:
            total = (total + 1)
        else:
            total = (total + nCk(n // cur + distinct - 1, distinct - 1))
        counters[-1] += 1
        c = len(counters) - 1
        while c >= 1 and counters[c] > fac_counts[c][1]:
            counters[c] = 0
            c -= 1
            counters[c] += 1
    DP[k][n] = total
    return DP[k][n]

n, k = map(int, input().split())
fac_counts = slow_factors(n)
print(solve(fac_counts, n, k) % MOD)
```

</div>

<div id="CONTEST-GOV-2-CPP" class="code-tabcontent CONTEST-GOV-2" markdown="1">

```cpp
// TODO
```

</div>

</div>

</div>
