#!/usr/bin/env python3
from pathlib import Path
import json, subprocess

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / 'demo-assets'
BUILD = ASSETS / 'video-build'
BUILD.mkdir(parents=True, exist_ok=True)
scenes = [
  ('01-hero.png', "This is MetaFence, a security-first Web M C P metadata triage lab. Metadata can help agents, but the same strings can contain prompt injection, secret requests, or executable markup. MetaFence keeps raw content behind a visible human review boundary."),
  ('02-queue.png', "The app starts with eight original synthetic records. A deterministic scanner assigns clear, review, or quarantine states. The normal human interface works in any modern browser. In a Web M C P browser, four narrowly scoped tools are registered as a progressive enhancement."),
  ('03-agent-staged.png', "Here the agent invoked stage metadata review with a quarantine filter and a maximum of three records. The page visibly changed to the bounded queue. The tool result contained IDs, lengths, risk labels, and reason codes, but none of the raw untrusted descriptions."),
  ('04-human-review.png', "Next, the agent requested human review for one record. The injected instruction appears only inside this clearly marked, human-visible panel. The agent's response says raw text returned to agent: false, and asks the person to inspect the panel. There is no approve, rewrite, or publish tool."),
  ('05-confirmed-export.png', "Finally, the agent staged a safe structural C S V. The response reports four rows, human confirmation required, and downloaded false. A person must click the final control. Every action is recorded in the visible event log. MetaFence makes agents useful without making untrusted content authoritative.")
]
segments=[]; manifest=[]
for idx,(image,narration) in enumerate(scenes,1):
    aiff=BUILD/f'audio-{idx:02d}.aiff'
    subprocess.run(['say','-v','Samantha','-r','174','-o',str(aiff),narration],check=True)
    duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(aiff)],text=True).strip())+0.5
    seg=BUILD/f'segment-{idx:02d}.mp4'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-loop','1','-i',str(ASSETS/image),'-i',str(aiff),'-t',f'{duration:.3f}','-vf','scale=1280:720,format=yuv420p','-r','30','-c:v','libx264','-preset','medium','-crf','18','-c:a','aac','-b:a','192k','-shortest',str(seg)],check=True)
    segments.append(seg); manifest.append({'scene':idx,'image':image,'duration_seconds':round(duration,3),'narration':narration})
concat=BUILD/'concat.txt'
concat.write_text(''.join(f"file '{x}'\n" for x in segments))
out=ROOT/'metafence-webmcp-demo.mp4'
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',str(concat),'-c','copy',str(out)],check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_name,width,height','-of','json',str(out)],text=True))
(ROOT/'DEMO_MANIFEST.json').write_text(json.dumps({'output':out.name,'scenes':manifest,'probe':probe},indent=2)+'\n')
print(out); print(json.dumps(probe,indent=2))
