with open('edubandhan_app.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        low = line.lower()
        if any(k in low for k in ['</style>', '<nav', 'id="tab', 'id="view', 'onclick="switch', 'onclick="show', 'channel', 'assign-teacher', 'view-admin', 'class-rooms']):
            print(f"{idx+1}: {line.strip()[:100]}")
