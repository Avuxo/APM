{
    'targets': [
        {
            'target_name': 'apm',
            'include_dirs': [
                "<!(node -e \"require('nan')\")"
            ],
            'sources': [
                'src/heap.cc'
            ]
        }
    ]
}
