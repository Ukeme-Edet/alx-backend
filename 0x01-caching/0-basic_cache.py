#!/usr/bin/env python3
"""
Basic dictionary
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ """

    def put(self, key, item):
        """
        Assign to the dictionary self.cache_data the item value for the key\
            key.

        Args:
            key: key to the dictionary
            item: value to assign to the key
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
        Return the value in self.cache_data linked to key.

        Args:
            key: key to the dictionary
        """
        if key is not None and key in self.cache_data:
            return self.cache_data[key]
        return None
