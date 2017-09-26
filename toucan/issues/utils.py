from collections import namedtuple

Block = namedtuple('Block', ['depth', 'entityRanges',
                             'inlineStyleRanges',  'key', 'text', 'type'])
BlockV2 = namedtuple('BlockV2', Block._fields + ('data',))

Entity = namedtuple('Entity', ['mutability', 'type', 'data', 'key'])
EntityRange = namedtuple('EntityRange', ['key', 'length', 'offset'])


def parse_draft_struct(ds):
    blocks = ds.get('blocks', [])
    em = ds.get('entityMap', {})
    print(blocks)
    bs = []
    for b in blocks:
        if 'data' in b:
            bs.append(BlockV2(**b))
        else:
            bs.append(Block(**b))

    return (
        bs,
        [Entity(key=k, **e) for k, e in em.items()]
    )


def decorate_block(block, entity_ranges):
    bt = block.text
    entity_ranges.sort(key=lambda x: x[0].offset)
    offsets = [(x[0].offset, x[0].length) for x in entity_ranges]

    for index, (offset, length) in enumerate(offsets):
        try:
            n = offsets[index + 1]
        except IndexError:
            continue

        assert(offset + length <= n[0])

    parts = []
    start = 0

    for er, entity in entity_ranges:
        entity_end = er.offset + length
        lp = bt[start:er.offset]
        ep = bt[er.offset:entity_end]
        rp = bt[entity_end:]
        parts.append(lp)
        parts.append('@' + ep)
        start = entity_end

    parts.append(rp)

    return ''.join(parts)


def draft_struct_to_comment(ds):

    blocks, entities = parse_draft_struct(ds)
    entities_by_key = {
        e.key: e for e in entities
    }
    texts = []

    for b in blocks:
        ers = [
            (
                EntityRange(**er),
                entities_by_key[str(er['key'])]
            ) for er in b.entityRanges
        ]
        text = b.text
        if len(ers):
            text = decorate_block(b, ers)

        texts.append(text)

    return '\n'.join(texts)
