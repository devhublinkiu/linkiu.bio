<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class VideoMaxDurationRule implements ValidationRule
{
    public function __construct(
        protected int $maxSeconds = 60
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile || ! $value->isValid()) {
            return;
        }

        $path = $value->getRealPath();
        $seconds = $this->getDurationSeconds($path);

        if ($seconds === null) {
            return;
        }

        if ($seconds > $this->maxSeconds) {
            $fail("El video no puede superar {$this->maxSeconds} segundos. Duración actual: " . (int) $seconds . ' s.');
        }
    }

    protected function getDurationSeconds(string $path): ?float
    {
        $cmd = sprintf(
            'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 %s 2>/dev/null',
            escapeshellarg($path)
        );

        $output = @shell_exec($cmd);
        if ($output === null || $output === '') {
            return null;
        }

        $duration = trim($output);
        if ($duration === '' || ! is_numeric($duration)) {
            return null;
        }

        return (float) $duration;
    }
}
