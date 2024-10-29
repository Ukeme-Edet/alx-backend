#!/usr/bin/env python3
"""
FIFO caching
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    Defines the dictionary cache
    """

    def __init__(self):
        """
        Initiliaze
        """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """
        Assign to the dictionary self.cache_data the item value for the key\
            key.

        Args:
            key: key to the dictionary
            item: value to assign to the key
        """
        if key is not None and item is not None:
            if key in self.queue:
                self.queue.remove(key)
            self.queue.append(key)
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                first_key = self.queue.pop(0)
                del self.cache_data[first_key]
                print("DISCARD: {}".format(first_key))

    def get(self, key):
        """
        Return the value in self.cache_data linked to key.

        Args:
            key: key to the dictionary
        """
        if key is not None and key in self.cache_data:
            return self.cache_data[key]
        return None
