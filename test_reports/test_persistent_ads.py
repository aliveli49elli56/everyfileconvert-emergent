import asyncio
from playwright.async_api import async_playwright

async def run_tests():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1920, "height": 1080})
        
        results = {}

        # ── VIDEO CONVERTER IDLE STATE ──────────────────────────────────────
        await page.goto('http://localhost:3000/en/video-converter', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        check = await page.evaluate("""() => {
            const slots = document.querySelectorAll('[data-testid^="persistent-ad"]');
            const dragSlot = document.querySelector('[data-testid="persistent-ad-drag_menu_under"]');
            const downloadSlot = document.querySelector('[data-testid="persistent-ad-download_ready_ad"]');
            const oldSlot = document.querySelector('[data-testid="ad-drag-menu-under"]');
            const dragClass = dragSlot ? dragSlot.className : '';
            const downloadClass = downloadSlot ? downloadSlot.className : '';
            const innerBg = dragSlot ? dragSlot.querySelector('.bg-gray-100') : null;
            const spans = dragSlot ? dragSlot.querySelectorAll('span') : [];
            return {
                slotsCount: slots.length,
                dragClass,
                downloadClass,
                dragVisible: dragClass.includes('block') && !dragClass.includes('hidden'),
                downloadHidden: downloadClass.includes('hidden'),
                noOldSlot: oldSlot === null,
                hasBgGray100: innerBg !== null,
                advertText: spans[0] ? spans[0].textContent : '',
                slotNameText: spans[1] ? spans[1].textContent : ''
            };
        }""")

        results['video_idle_slots_count'] = check['slotsCount']
        results['video_idle_drag_visible'] = check['dragVisible']
        results['video_idle_download_hidden'] = check['downloadHidden']
        results['video_no_old_slot'] = check['noOldSlot']
        results['video_bg_gray100'] = check['hasBgGray100']
        results['video_advert_text'] = check['advertText']
        results['video_slot_name'] = check['slotNameText']

        print(f"[VIDEO IDLE] slots in DOM=2: {'PASS' if check['slotsCount']==2 else 'FAIL'} ({check['slotsCount']})")
        print(f"[VIDEO IDLE] drag_menu_under visible: {'PASS' if check['dragVisible'] else 'FAIL'} class={check['dragClass']}")
        print(f"[VIDEO IDLE] download_ready_ad hidden: {'PASS' if check['downloadHidden'] else 'FAIL'} class={check['downloadClass']}")
        print(f"[VIDEO IDLE] no old ad-drag-menu-under: {'PASS' if check['noOldSlot'] else 'FAIL'}")
        print(f"[VIDEO IDLE] bg-gray-100: {'PASS' if check['hasBgGray100'] else 'FAIL'}")
        print(f"[VIDEO IDLE] Advertisement text: {check['advertText']}")
        print(f"[VIDEO IDLE] slotName text: {check['slotNameText']}")

        # ── AUDIO CONVERTER IDLE STATE ───────────────────────────────────────
        await page.goto('http://localhost:3000/en/audio-converter', wait_until='networkidle')
        await page.wait_for_timeout(500)
        audio = await page.evaluate("""() => {
            const slots = document.querySelectorAll('[data-testid^="persistent-ad"]');
            const dragSlot = document.querySelector('[data-testid="persistent-ad-drag_menu_under"]');
            const downloadSlot = document.querySelector('[data-testid="persistent-ad-download_ready_ad"]');
            const dragClass = dragSlot ? dragSlot.className : '';
            const downloadClass = downloadSlot ? downloadSlot.className : '';
            return {
                count: slots.length,
                dragVisible: dragClass.includes('block') && !dragClass.includes('hidden'),
                downloadHidden: downloadClass.includes('hidden')
            };
        }""")
        print(f"[AUDIO IDLE] slots=2: {'PASS' if audio['count']==2 else 'FAIL'} ({audio['count']}) drag visible: {'PASS' if audio['dragVisible'] else 'FAIL'} download hidden: {'PASS' if audio['downloadHidden'] else 'FAIL'}")

        # ── IMAGE CONVERTER IDLE STATE ───────────────────────────────────────
        await page.goto('http://localhost:3000/en/image-converter', wait_until='networkidle')
        await page.wait_for_timeout(500)
        image = await page.evaluate("""() => {
            const slots = document.querySelectorAll('[data-testid^="persistent-ad"]');
            const dragSlot = document.querySelector('[data-testid="persistent-ad-drag_menu_under"]');
            const downloadSlot = document.querySelector('[data-testid="persistent-ad-download_ready_ad"]');
            const dragClass = dragSlot ? dragSlot.className : '';
            const downloadClass = downloadSlot ? downloadSlot.className : '';
            return {
                count: slots.length,
                dragVisible: dragClass.includes('block') && !dragClass.includes('hidden'),
                downloadHidden: downloadClass.includes('hidden')
            };
        }""")
        print(f"[IMAGE IDLE] slots=2: {'PASS' if image['count']==2 else 'FAIL'} ({image['count']}) drag visible: {'PASS' if image['dragVisible'] else 'FAIL'} download hidden: {'PASS' if image['downloadHidden'] else 'FAIL'}")

        # ── HOMEPAGE ─────────────────────────────────────────────────────────
        await page.goto('http://localhost:3000/en', wait_until='networkidle')
        await page.wait_for_timeout(500)
        home = await page.evaluate("""() => {
            const dragMenuUnderPersistent = document.querySelector('[data-testid="persistent-ad-drag_menu_under"]');
            const toolsInfeed = document.querySelector('[data-testid="ad-slot-tools_infeed_1-300x250"]');
            const dragClass = dragMenuUnderPersistent ? dragMenuUnderPersistent.className : '';
            return {
                hasPersistentDrag: dragMenuUnderPersistent !== null,
                dragVisible: dragClass.includes('block') && !dragClass.includes('hidden'),
                hasToolsInfeed1: toolsInfeed !== null
            };
        }""")
        print(f"[HOME] persistent-ad-drag_menu_under present & visible: {'PASS' if home['hasPersistentDrag'] and home['dragVisible'] else 'FAIL'}")
        print(f"[HOME] tools_infeed_1 (data-testid=ad-slot-tools_infeed_1-300x250) present: {'PASS' if home['hasToolsInfeed1'] else 'FAIL'}")

        # ── SUCCESS STATE (JS injection on video-converter) ───────────────────
        await page.goto('http://localhost:3000/en/video-converter', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        # Simulate file select using set_input_files with a small dummy video blob
        import tempfile, os
        tmp = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
        tmp.write(b'\x00' * 1024)  # 1KB dummy mp4
        tmp.close()
        
        file_input = await page.query_selector('input[type="file"]')
        if file_input:
            await file_input.set_input_files(tmp.name)
            await page.wait_for_timeout(500)
            os.unlink(tmp.name)
            
            # Check pending state - drag_menu_under should still be visible
            pending_check = await page.evaluate("""() => {
                const dragSlot = document.querySelector('[data-testid="persistent-ad-drag_menu_under"]');
                const downloadSlot = document.querySelector('[data-testid="persistent-ad-download_ready_ad"]');
                const dragClass = dragSlot ? dragSlot.className : '';
                const downloadClass = downloadSlot ? downloadSlot.className : '';
                return {
                    dragClass,
                    downloadClass,
                    dragVisible: dragClass.includes('block') && !dragClass.includes('hidden'),
                    downloadHidden: downloadClass.includes('hidden'),
                    slotsCount: document.querySelectorAll('[data-testid^="persistent-ad"]').length
                };
            }""")
            print(f"[PENDING STATE] slots still in DOM=2: {'PASS' if pending_check['slotsCount']==2 else 'FAIL'} ({pending_check['slotsCount']})")
            print(f"[PENDING STATE] drag_menu_under visible: {'PASS' if pending_check['dragVisible'] else 'FAIL'} class={pending_check['dragClass']}")
            print(f"[PENDING STATE] download_ready_ad hidden: {'PASS' if pending_check['downloadHidden'] else 'FAIL'} class={pending_check['downloadClass']}")
        else:
            print("[PENDING STATE] Could not find file input")
        
        # Take a screenshot of the current state
        await page.screenshot(path='.screenshots/video_converter_tests.png', quality=40, full_page=False)
        
        await browser.close()
        print("\n=== ALL TESTS COMPLETE ===")

asyncio.run(run_tests())
