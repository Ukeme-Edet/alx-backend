#!/usr/bin/env python3
"""
LFU caching
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    Defines the dictionary cache
    """

    def __init__(self):
        """
        Initiliaze
        """
        super().__init__()
        self.queue = []
        self.count = {}

    def put(self, key, item):
        """
        Assign to the dictionary self.cache_data the item value for the key\
            key.

        Args:
            key: key to the dictionary
            item: value to assign to the key
        """
        if key is not None and item is not None:
            if (
                len(self.cache_data) >= BaseCaching.MAX_ITEMS
                and key not in self.cache_data
            ):
                min_value = min(self.count.values())
                keys = [k for k, v in self.count.items() if v == min_value]
                for k in self.queue:
                    if k in keys:
                        del self.cache_data[k]
                        del self.count[k]
                        self.queue.remove(k)
                        print("DISCARD: {}".format(k))
                        break
            if key in self.queue:
                self.queue.remove(key)
            self.queue.append(key)
            self.cache_data[key] = item
            if key not in self.count:
                self.count[key] = 1
            else:
                self.count[key] += 1

    def get(self, key):
        """
        Return the value in self.cache_data linked to key.

        Args:
            key: key to the dictionary
        """
        if key is not None and key in self.cache_data:
            self.queue.remove(key)
            self.queue.append(key)
            self.count[key] += 1
            return self.cache_data[key]
        return None
