"""Dev-only media server with HTTP Range support.

Django's built-in static serve ignores the Range header, so browsers can't
seek inside a video. This tiny view answers Range requests with 206 Partial
Content. In production let Nginx / a CDN / cloud storage serve /media/.
"""

import mimetypes
import os
import re

from django.conf import settings
from django.http import Http404, HttpResponse, StreamingHttpResponse
from django.utils._os import safe_join

RANGE_RE = re.compile(r"bytes\s*=\s*(\d*)\s*-\s*(\d*)", re.I)


def _read_chunks(path, start, length, chunk_size=64 * 1024):
    with open(path, "rb") as f:
        f.seek(start)
        remaining = length
        while remaining > 0:
            data = f.read(min(chunk_size, remaining))
            if not data:
                break
            remaining -= len(data)
            yield data


def serve_media(request, path):
    try:
        full_path = safe_join(settings.MEDIA_ROOT, path)  # blocks ../ tricks
    except Exception:
        raise Http404("Not found")
    if not os.path.isfile(full_path):
        raise Http404("Not found")

    size = os.path.getsize(full_path)
    content_type = mimetypes.guess_type(full_path)[0] or "application/octet-stream"
    if full_path.endswith(".vtt"):
        content_type = "text/vtt"

    match = RANGE_RE.match(request.META.get("HTTP_RANGE", ""))
    if not match:
        response = StreamingHttpResponse(_read_chunks(full_path, 0, size), content_type=content_type)
        response["Content-Length"] = str(size)
        response["Accept-Ranges"] = "bytes"
        return response

    first, last = match.groups()
    if first == "" and last != "":  # suffix range: last N bytes
        start = max(size - int(last), 0)
        end = size - 1
    else:
        start = int(first or 0)
        end = int(last) if last else size - 1
    end = min(end, size - 1)

    if start > end or start >= size:
        response = HttpResponse(status=416)
        response["Content-Range"] = f"bytes */{size}"
        return response

    length = end - start + 1
    response = StreamingHttpResponse(
        _read_chunks(full_path, start, length), status=206, content_type=content_type
    )
    response["Content-Length"] = str(length)
    response["Content-Range"] = f"bytes {start}-{end}/{size}"
    response["Accept-Ranges"] = "bytes"
    return response
