---
title: Primes and Factorization Techniques
author: Jackson Goerner
date: 2021-04-05 12:00:00 +1100
categories: [Math]
tags: [Difficulty 3]
math: true
code: true
problems:
- name: CF58B - Coins
  link: https://codeforces.com/contest/58/problem/B
- name: Ada and Primes
  link: https://www.spoj.com/problems/ADAPRIME/
- name: Room Change
  link: https://www.spoj.com/problems/CHGROOM/
- name: Max GCD
  link: https://atcoder.jp/contests/abc136/tasks/abc136_e
- name: Even Semiprime Runs
  link: https://www.spoj.com/problems/EVENSEMIP/
- name: CF101992D - The Millennium Prize Problems
  link: https://codeforces.com/gym/101992/problem/D
- name: CF1497E2 - Square Free Division
  link: https://codeforces.com/problemset/problem/1497/E2
---

# Why?

Many number theoretic problems in competitive programming require analysing the factors or prime factors of a number.
Here I'll list a few techniques for finding these factors, and some techniques / properties involving the factors / prime factors of a number.

# Preliminaries

First off, lets define our basic terms, then we can get into the interesting stuff.

## Definitions

For a positive integer \\(x\\), a positive integer \\(y\\) is a factor of \\(x\\) if \\(x\\) can be expressed as \\(yk\\) for some other positive integer \\(k\\).
A factor \\(y\\) is a prime factor if \\(y\\) is prime.

A factorization of a positive integer \\(x\\) is a collection of (not necessarily distinct) factors \\(y_i\\) satisfying \\(y_0 \times y_1 \times \cdots \times y_k = x\\).
A prime factorization is a factorization where all \\(y_i\\) are prime factors.

All the below properties depend on the fact that 1 is **not** a prime number. I repeat: in all algorithms from now on (and I think you should adopt this generally too) we do **not** consider 1 to be a prime number!

## Basic Properties

Every positive integer has a single unique prime factorization. I'll leave it as an exercise for you to prove this is true with induction.

Let's suppose \\(x\\) can be written in the form

$$
  x = y_0^{a_0} \times y_1^{a_1} \times y_2^{a_2} \times \cdots ,
$$

where $y_i$ are distinct primes. Then there are \\((a_0+1)\times(a_1+1)\times(a_2+1)\times\cdots\\) factors of $x$, since any factor can use anywhere from \\(0\\) to \\(a_i\\) copies of prime \\(p_i\\).

Given the prime factorization of two numbers \\(x\\) and \\(y\\), we can find the gcd simply by considering the intersection of their factorizations. The lcm of those two numbers is the union of their factorizations.

# Finding Factors / Primes

## Sieve of Eratosthenes

A simple (but powerful) approach is that of the [Erathosthenes](https://www.wikiwand.com/en/Sieve_of_Eratosthenes): Go through each prime, and mark all multiples of that prime as not prime.

<div class="code-tab">
    <button class="code-tablinks Factor-1-link" onclick="openCodeTab(event, 'Factor-1', 'Factor-1-Python')">Python</button>
    <button class="code-tablinks Factor-1-link" onclick="openCodeTab(event, 'Factor-1', 'Factor-1-CPP')">CPP</button>
</div>

<div id="Factor-1-Python" class="code-tabcontent Factor-1"  markdown="1">

```python
def sieve(n):
  isprime = [True]*(n+1)
  isprime[0], isprime[1] = False, False
  i=2
  while i*i <= n:
    if not isprime[i]:
      i += 1
      continue
    j=i*i
    while j <= n:
      isprime[j] = False
      j += i
    i += 1
  return isprime
```

</div>

<div id="Factor-1-CPP" class="code-tabcontent Factor-1" markdown="1">

```cpp
vector<bool> isprime;
void sieve(int n) {
  isprime.assign(n+1, 1);
  isprime[0] = isprime[1] = 0;
  for (int i=2; i * i <= n; i++) if (isprime[i]) {
    for (int j=i*i; j <= n; j+= i) isprime[j] = 0;
  }
}
```

</div>

There is some optimization going on here. We only want to mark off multiples of \\(i\\) in the `isprime` vector where \\(i\\) is the smallest prime factor of that multiple. This is the reason we can end when \\(i \times i > n\\) and start at \\(j = i \times i\\).

This operation is contest safe until about \\(10^8\\).

## Factors with Sieve
While finding whether a number is prime is all well and good, rather than just recording primality, why not also record what prime factor caused us not to be prime? From this information we can then generate prime factors of a number, if we wish.

<div class="code-tab">
    <button class="code-tablinks Factor-2-link" onclick="openCodeTab(event, 'Factor-2', 'Factor-2-Python')">Python</button>
    <button class="code-tablinks Factor-2-link" onclick="openCodeTab(event, 'Factor-2', 'Factor-2-CPP')">CPP</button>
</div>

<div id="Factor-2-Python" class="code-tabcontent Factor-2"  markdown="1">

```python
def factor_sieve(n):
  # factor[i] = a factor of i. factor[1] = 0.
  factor = [0]*(n+1)
  primes = []
  for i in range(2, n+1):
    if factor[i] == 0:
      factor[i] = i
      primes.append(i)
    # Make sure that the smallest factor is always listed.
    for p in primes:
      if (p > factor[i] or i * p > n): break
      factor[i * p] = p
  return factor, primes
```

</div>

<div id="Factor-2-CPP" class="code-tabcontent Factor-2" markdown="1">

```cpp
vi factor, primes;
void factor_sieve(int n) {
  // factor[i] = a factor of i. factor[1] = 0.
  factor.assign(n+1, 0);
  for (int i=2; i <= n; i++) {
    if (factor[i] == 0) {
      factor[i] = i;
      primes.push_back(i);
    }
    // Make sure that the smallest factor is always listed.
    for (int p: primes) if (p > factor[i] || i * p > n) break; else factor[i * p] = p;
  }
}
```
</div>

This operation is contest safe until about \\(10^7\\).

## Prime Factorizations with precomp

If we want to get a full list of prime factors given we've done the above precomputation, we can just repeatedly divide `i` by `factor[i]` until we hit 1.

<div class="code-tab">
    <button class="code-tablinks Factor-3-link" onclick="openCodeTab(event, 'Factor-3', 'Factor-3-Python')">Python</button>
    <button class="code-tablinks Factor-3-link" onclick="openCodeTab(event, 'Factor-3', 'Factor-3-CPP')">CPP</button>
</div>

<div id="Factor-3-Python" class="code-tabcontent Factor-3"  markdown="1">

```python
def fast_factors(n, factor):
  res = []
  while n > 1:
    f = factor[n]
    # Remove this line to include duplicate factors.
    while n % f == 0:
      n //= f
    res.append(f)
  return res
```

</div>

<div id="Factor-3-CPP" class="code-tabcontent Factor-3" markdown="1">

```cpp
vi fast_factors(int n) {
  vi res;
  while (n > 1) {
    int f = factor[n];
    while (n % f == 0) n /= f; // Remove the while to include duplicate factors.
    res.push_back(f);
  }
  return res;
}
```

</div>

## Prime factors without precomp

If you are only testing a few numbers for prime factors, you can instead do this in \\(O(\sqrt{n})\\):

<div class="code-tab">
    <button class="code-tablinks Factor-4-link" onclick="openCodeTab(event, 'Factor-4', 'Factor-4-Python')">Python</button>
    <button class="code-tablinks Factor-4-link" onclick="openCodeTab(event, 'Factor-4', 'Factor-4-CPP')">CPP</button>
</div>

<div id="Factor-4-Python" class="code-tabcontent Factor-4"  markdown="1">

```python
def slow_factors(n):
  res = []
  i = 2
  while i*i <= n:
    # Change to while for duplicates
    if n % i == 0:
      res.append(i)
      # Remove while for duplicates.
      while n % i == 0:
        n //= i
    i += 1
  if n > 1:
    res.append(n)
  return res
```

</div>

<div id="Factor-4-CPP" class="code-tabcontent Factor-4" markdown="1">

```cpp
vll slow_factors(ll n) {
  vll res;
  for (ll i=2; i*i <= n; i++)
    if (n % i == 0) { // change to while for duplicates
      res.push_back(i);
      while (n % i == 0) n /= i; // Remove while for duplicates
    }
  if (n > 1) res.push_back(n);
  return res;
}
```

</div>

## Fast Prime Testing

The first three algorithms are good when you need to know the primality / factors of numbers in a range. If you just want to test a single number, we can do much better though. As we've seen we can get the prime factorization in \\(O(\sqrt{n})\\), but for just primality testing, we can do \\(O(\log(n))\\) with Miller-Rabin.

I won't go into details how this works, but we provide Miller-Rabin with some bases depending on how big our number is:

<div class="code-tab">
    <button class="code-tablinks Factor-5-link" onclick="openCodeTab(event, 'Factor-5', 'Factor-5-Python')">Python</button>
    <button class="code-tablinks Factor-5-link" onclick="openCodeTab(event, 'Factor-5', 'Factor-5-CPP')">CPP</button>
</div>

<div id="Factor-5-Python" class="code-tabcontent Factor-5"  markdown="1">

```python
val = [2, 7, 61]                                    # for n <= 2^32
val = [2, 13, 23, 1662803]                          # for n <= 10^12
val = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]  # for n <= 2^64

def isprime(n):
  if n < 2: return False
  d = n - 1
  s = 0
  while d & 1 == 0:
    d >>= 1
    s += 1
  for v in val:
    if v >= n: break
    # v^d mod n.
    x = expmod(v, d, n)
    if (x == 1 or x == n-1): continue
    for r in range(s):
      x = expmod(x, 2, n)
      if (x == n - 1): break
    else:
      return False
  return True
```

</div>

<div id="Factor-5-CPP" class="code-tabcontent Factor-5" markdown="1">

```cpp
vi val = {2, 7, 61};                                    // n <= 2^32
vi val = {2, 13, 23, 1662803};                          // n <= 10^12
vi val = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};  // n <= 2^64 (replace ll with __int128)

bool isprime(ll n) {
  if (n < 2) return false;
  ll s = __builtin_ctzll(n-1), d = (n - 1) >> s;
  for (int v: val) {
    if (v >= n) break;
    ll x = expmod(v, d, n);
    if (x == 1 || x == n-1) continue;
    // big is typedef'd to __int128
    for (ll r=1; r<s; r++) if ((x = ((big(x)*x) % n)) == n-1) goto nextPrime;
    return false;
    nextPrime:;
  }
  return true;
}
```

</div>

You can learn more about Deterministic Miller-Rabin [here](https://www.wikiwand.com/en/Miller%E2%80%93Rabin_primality_test#/Deterministic_variants).

# Cool properties

Since factors and primes can be thought of as the building blocks of all the integers and to some extent are still shrouded in mystery, there are lots of cool properties of primes that we might want to utilise in programming problems.

## Squares

The prime factorization of squares has \\(a_i\\) even for all \\(i\\), where

$$
  x = y_0^{a_0}\times y_1^{a_1} \times y_2^{a_2} \times \cdots.
$$

Another way of thinking about this is that every square number can be factorized into prime squares.

In general for powers of 3, 4, etc. Simply replace "\\(a_i\\) even" with "\\(a_i\\) divisible by 3, 4, etc".

## Sums

Suppose we add two coprime numbers \\(A\\) and \\(B\\) (Numbers with gcd\\((A, B) = 1\\)).
We know their sum must then be coprime to both \\(A\\) and \\(B\\) (\\(\text{gcd}(A+B, A) = \text{gcd}(A+B, B) = 1\\)).
In other words, the prime factorization of \\(A+B\\) comprises of primes which are neither in \\(A\\) nor \\(B\\).

## Factorization Wheels

While going through with the Sieve method is good for finding the composite / prime status of every number, if you just want to list off primes it might be better to combine with a wheel factorization method, allowing you to strike off many candidates based on the first few factors.

You can find out about wheel factorization [here](https://www.wikiwand.com/en/Wheel_factorization).

## Sieve starting at different positions

As we've seen previously, the sieve of Eratosthenes only needs to consider primes less than \\(\sqrt{n}\\) for the algorithm to work (This can be reasoned by noting that any composite number requires a factor less than or equal to \\(\sqrt{n}\\)).

Therefore, we can modify our solution slightly to compute the prime numbers in some other range. For example, to compute the primes between \\(10^{12} - 10^7\\) and \\(10^{12}\\):

* Use the sieve to find all primes less than \\(\sqrt{10^{12}} = 10^6\\).
* Sieve over these primes in the range \\(10^{12} - 10^7\\) to \\(10^{12}\\). Anything not marked as composite must be prime!

We can actually continue this argument with contiguous segments to get a \\(\sqrt{n}\\) space complexity sieve implementation. For details see [here](https://www.wikiwand.com/en/Sieve_of_Eratosthenes#/Segmented_sieve)
