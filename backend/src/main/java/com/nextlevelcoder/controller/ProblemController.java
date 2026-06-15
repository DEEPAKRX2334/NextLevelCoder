package com.nextlevelcoder.controller;

import com.nextlevelcoder.dto.ProblemStatusResponse;
import com.nextlevelcoder.dto.RunResponse;
import com.nextlevelcoder.dto.SubmissionRequest;
import com.nextlevelcoder.dto.SubmissionResponse;
import com.nextlevelcoder.model.CodingProblem;
import com.nextlevelcoder.model.Profile;
import com.nextlevelcoder.model.Submission;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.CodingProblemRepository;
import com.nextlevelcoder.repository.ProfileRepository;
import com.nextlevelcoder.repository.SubmissionRepository;
import com.nextlevelcoder.repository.UserRepository;
import com.nextlevelcoder.security.UserDetailsImpl;
import com.nextlevelcoder.service.AchievementService;
import com.nextlevelcoder.service.BookmarkService;
import com.nextlevelcoder.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private GoalService goalService;

    private final Random random = new Random();

    private static class TestCase {
        String input;
        String expectedOutput;

        TestCase(String input, String expectedOutput) {
            this.input = input;
            this.expectedOutput = expectedOutput;
        }
    }

    private static class ExecutionResult {
        String status;
        String errorMessage;
        long timeMs;
        long cpuTimeMs;
        double memoryMb;

        ExecutionResult(String status, String errorMessage, long timeMs, long cpuTimeMs, double memoryMb) {
            this.status = status;
            this.errorMessage = errorMessage;
            this.timeMs = timeMs;
            this.cpuTimeMs = cpuTimeMs;
            this.memoryMb = memoryMb;
        }
    }

    private List<TestCase> getTestCasesForProblem(String title) {
        List<TestCase> testCases = new ArrayList<>();
        String lowerTitle = title.toLowerCase();

        if (lowerTitle.contains("reverse a number")) {
            testCases.add(new TestCase("1234\n", "4321"));
            testCases.add(new TestCase("-56\n", "-65"));
        } else if (lowerTitle.contains("check palindrome number")) {
            testCases.add(new TestCase("121\n", "Yes"));
            testCases.add(new TestCase("123\n", "No"));
        } else if (lowerTitle.contains("count digits")) {
            testCases.add(new TestCase("5061\n", "4"));
            testCases.add(new TestCase("7\n", "1"));
        } else if (lowerTitle.contains("sum of digits")) {
            testCases.add(new TestCase("123\n", "6"));
            testCases.add(new TestCase("999\n", "27"));
        } else if (lowerTitle.contains("product of digits")) {
            testCases.add(new TestCase("234\n", "24"));
            testCases.add(new TestCase("505\n", "0"));
        } else if (lowerTitle.contains("largest digit")) {
            testCases.add(new TestCase("175\n", "7"));
            testCases.add(new TestCase("923\n", "9"));
        } else if (lowerTitle.contains("smallest digit")) {
            testCases.add(new TestCase("239\n", "2"));
            testCases.add(new TestCase("451\n", "1"));
        } else if (lowerTitle.contains("armstrong number")) {
            testCases.add(new TestCase("153\n", "Yes"));
            testCases.add(new TestCase("370\n", "Yes"));
            testCases.add(new TestCase("123\n", "No"));
        } else if (lowerTitle.contains("strong number")) {
            testCases.add(new TestCase("145\n", "Yes"));
            testCases.add(new TestCase("123\n", "No"));
        } else if (lowerTitle.contains("fibonacci series")) {
            testCases.add(new TestCase("1\n", "0 1 1 2 3 5 8"));
        } else if (lowerTitle.contains("reverse a string")) {
            testCases.add(new TestCase("hello\n", "olleh"));
            testCases.add(new TestCase("java\n", "avaj"));
        } else if (lowerTitle.contains("palindrome string")) {
            testCases.add(new TestCase("radar\n", "Yes"));
            testCases.add(new TestCase("hello\n", "No"));
        } else if (lowerTitle.contains("vowels and consonants")) {
            testCases.add(new TestCase("hello\n", "2 3"));
            testCases.add(new TestCase("nextlevel\n", "3 6"));
        } else if (lowerTitle.contains("words in a sentence")) {
            testCases.add(new TestCase("Hello world from nextlevel\n", "4"));
        } else if (lowerTitle.contains("remove spaces")) {
            testCases.add(new TestCase("a b c d\n", "abcd"));
        } else if (lowerTitle.contains("duplicate characters")) {
            testCases.add(new TestCase("programming\n", "g m r"));
        } else if (lowerTitle.contains("non-repeating character")) {
            testCases.add(new TestCase("swiss\n", "w"));
        } else if (lowerTitle.contains("lowercase to uppercase")) {
            testCases.add(new TestCase("nextlevel\n", "NEXTLEVEL"));
        } else if (lowerTitle.contains("anagram strings")) {
            testCases.add(new TestCase("listen silent\n", "Yes"));
            testCases.add(new TestCase("hello world\n", "No"));
        } else if (lowerTitle.contains("sort characters")) {
            testCases.add(new TestCase("coder\n", "cdeor"));
        } else if (lowerTitle.contains("largest element")) {
            testCases.add(new TestCase("4 9 2 15 6\n", "15"));
        } else if (lowerTitle.contains("smallest element")) {
            testCases.add(new TestCase("8 4 11 2 9\n", "2"));
        } else if (lowerTitle.contains("sum and average")) {
            testCases.add(new TestCase("1 2 3 4 5\n", "15 3"));
        } else if (lowerTitle.contains("reverse an array")) {
            testCases.add(new TestCase("1 2 3 4\n", "4 3 2 1"));
        } else if (lowerTitle.contains("ascending order")) {
            testCases.add(new TestCase("5 2 9 1\n", "1 2 5 9"));
        } else if (lowerTitle.contains("second largest")) {
            testCases.add(new TestCase("12 35 1 10 34\n", "34"));
        } else if (lowerTitle.contains("remove duplicate elements")) {
            testCases.add(new TestCase("1 2 2 3 4 4 5\n", "1 2 3 4 5"));
        } else if (lowerTitle.contains("merge two arrays")) {
            testCases.add(new TestCase("1 3 5\n2 4 6\n", "1 2 3 4 5 6"));
        } else if (lowerTitle.contains("search element")) {
            testCases.add(new TestCase("10 20 30 40\n30\n", "2"));
            testCases.add(new TestCase("10 20 30 40\n50\n", "-1"));
        } else if (lowerTitle.contains("even and odd numbers")) {
            testCases.add(new TestCase("1 2 3 4 5\n", "2 3"));
        } else if (lowerTitle.contains("star square pattern")) {
            testCases.add(new TestCase("3\n", "***\n***\n***"));
        } else if (lowerTitle.contains("right triangle star pattern")) {
            testCases.add(new TestCase("3\n", "*\n**\n***"));
        } else if (lowerTitle.contains("inverted triangle pattern")) {
            testCases.add(new TestCase("3\n", "***\n**\n*"));
        } else if (lowerTitle.contains("pyramid pattern")) {
            testCases.add(new TestCase("3\n", "  *\n ***\n*****"));
        } else if (lowerTitle.contains("diamond pattern")) {
            testCases.add(new TestCase("2\n", " *\n***\n *"));
            testCases.add(new TestCase("3\n", "  *\n ***\n*****\n ***\n  *"));
        } else if (lowerTitle.contains("floyd")) {
            testCases.add(new TestCase("3\n", "1\n2 3\n4 5 6"));
            testCases.add(new TestCase("4\n", "1\n2 3\n4 5 6\n7 8 9 10"));
        } else if (lowerTitle.contains("pascal")) {
            testCases.add(new TestCase("3\n", "1\n1 1\n1 2 1"));
            testCases.add(new TestCase("4\n", "1\n1 1\n1 2 1\n1 3 3 1"));
        } else if (lowerTitle.contains("number increasing pattern")) {
            testCases.add(new TestCase("3\n", "1\n1 2\n1 2 3"));
            testCases.add(new TestCase("4\n", "1\n1 2\n1 2 3\n1 2 3 4"));
        } else if (lowerTitle.contains("alphabet pattern")) {
            testCases.add(new TestCase("3\n", "A\nB B\nC C C"));
            testCases.add(new TestCase("4\n", "A\nB B\nC C C\nD D D D"));
        } else if (lowerTitle.contains("hollow square pattern")) {
            testCases.add(new TestCase("3\n", "***\n* *\n***"));
            testCases.add(new TestCase("4\n", "****\n*  *\n*  *\n****"));
        } else if (lowerTitle.contains("calculate factorial")) {
            testCases.add(new TestCase("5\n", "120"));
            testCases.add(new TestCase("0\n", "1"));
        } else if (lowerTitle.contains("binary search element")) {
            testCases.add(new TestCase("1 3 5 7 9\n5\n", "2"));
            testCases.add(new TestCase("1 3 5 7 9\n4\n", "-1"));
        } else {
            testCases.add(new TestCase("3\n", ""));
        }

        return testCases;
    }

    private ExecutionResult executeJavaScript(String code, List<TestCase> testCases) {
        long startTime = System.currentTimeMillis();
        java.io.File tempDir = null;
        long maxCpuTime = 0;
        double maxMemoryMb = 0.0;
        try {
            String userDir = System.getProperty("user.dir");
            java.io.File workspaceTemp = new java.io.File(userDir, "temp_sandbox");
            if (!workspaceTemp.exists()) {
                workspaceTemp.mkdirs();
            }
            tempDir = java.nio.file.Files.createTempDirectory(workspaceTemp.toPath(), "js_").toFile();

            java.io.File jsFile = new java.io.File(tempDir, "submission.js");
            java.nio.file.Files.writeString(jsFile.toPath(), code);

            for (TestCase tc : testCases) {
                ProcessBuilder pb = new ProcessBuilder("node", jsFile.getAbsolutePath());
                pb.directory(tempDir);
                Process process = pb.start();

                com.nextlevelcoder.util.ProcessResourceTracker tracker = new com.nextlevelcoder.util.ProcessResourceTracker(process, "JavaScript");
                tracker.start();

                try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(tc.input);
                    writer.flush();
                }

                boolean completed = process.waitFor(2, java.util.concurrent.TimeUnit.SECONDS);
                tracker.stop();

                maxCpuTime = Math.max(maxCpuTime, tracker.getCpuTimeMs());
                maxMemoryMb = Math.max(maxMemoryMb, tracker.getPeakMemoryMb());

                if (!completed) {
                    process.destroyForcibly();
                    return new ExecutionResult("Time Limit Exceeded", "Time Limit Exceeded: Code execution exceeded 2000ms.", System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }

                if (process.exitValue() != 0) {
                    String stderr = new String(process.getErrorStream().readAllBytes());
                    return new ExecutionResult("Runtime Error", "Runtime Error (exit code " + process.exitValue() + "):\n" + stderr, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }

                String stdout = new String(process.getInputStream().readAllBytes());
                if (!compareOutput(stdout, tc.expectedOutput)) {
                    return new ExecutionResult("Wrong Answer", "Wrong Answer.\nInput:\n" + tc.input + "\nExpected Output:\n" + tc.expectedOutput + "\nYour Output:\n" + stdout, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }
            }

            return new ExecutionResult("Accepted", null, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);

        } catch (Exception e) {
            return new ExecutionResult("Runtime Error", "Internal Execution Error: " + e.getMessage(), System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
        } finally {
            if (tempDir != null) {
                deleteDir(tempDir);
            }
        }
    }

    private ExecutionResult executeJava(String code, List<TestCase> testCases) {
        long startTime = System.currentTimeMillis();
        java.io.File tempDir = null;
        long maxCpuTime = 0;
        double maxMemoryMb = 0.0;
        try {
            String userDir = System.getProperty("user.dir");
            java.io.File workspaceTemp = new java.io.File(userDir, "temp_sandbox");
            if (!workspaceTemp.exists()) {
                workspaceTemp.mkdirs();
            }
            tempDir = java.nio.file.Files.createTempDirectory(workspaceTemp.toPath(), "java_").toFile();

            java.io.File javaFile = new java.io.File(tempDir, "Main.java");
            java.nio.file.Files.writeString(javaFile.toPath(), code);

            ProcessBuilder compilePb = new ProcessBuilder("javac", "Main.java");
            compilePb.directory(tempDir);
            Process compileProcess = compilePb.start();

            boolean compiled = compileProcess.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
            if (!compiled) {
                compileProcess.destroyForcibly();
                return new ExecutionResult("Compilation Error", "Compilation Timeout: javac compiler timed out.", System.currentTimeMillis() - startTime, 0, 0);
            }

            if (compileProcess.exitValue() != 0) {
                String compileStderr = new String(compileProcess.getErrorStream().readAllBytes());
                return new ExecutionResult("Compilation Error", "Compilation Error:\n" + compileStderr, System.currentTimeMillis() - startTime, 0, 0);
            }

            for (TestCase tc : testCases) {
                ProcessBuilder pb = new ProcessBuilder("java", "-cp", ".", "Main");
                pb.directory(tempDir);
                Process process = pb.start();

                com.nextlevelcoder.util.ProcessResourceTracker tracker = new com.nextlevelcoder.util.ProcessResourceTracker(process, "Java");
                tracker.start();

                try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(tc.input);
                    writer.flush();
                }

                boolean completed = process.waitFor(2, java.util.concurrent.TimeUnit.SECONDS);
                tracker.stop();

                maxCpuTime = Math.max(maxCpuTime, tracker.getCpuTimeMs());
                maxMemoryMb = Math.max(maxMemoryMb, tracker.getPeakMemoryMb());

                if (!completed) {
                    process.destroyForcibly();
                    return new ExecutionResult("Time Limit Exceeded", "Time Limit Exceeded: Code execution exceeded 2000ms.", System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }

                if (process.exitValue() != 0) {
                    String stderr = new String(process.getErrorStream().readAllBytes());
                    return new ExecutionResult("Runtime Error", "Runtime Error (exit code " + process.exitValue() + "):\n" + stderr, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }

                String stdout = new String(process.getInputStream().readAllBytes());
                if (!compareOutput(stdout, tc.expectedOutput)) {
                    return new ExecutionResult("Wrong Answer", "Wrong Answer.\nInput:\n" + tc.input + "\nExpected Output:\n" + tc.expectedOutput + "\nYour Output:\n" + stdout, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }
            }

            return new ExecutionResult("Accepted", null, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);

        } catch (Exception e) {
            return new ExecutionResult("Compilation Error", "Internal Compilation / Execution Error: " + e.getMessage(), System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
        } finally {
            if (tempDir != null) {
                deleteDir(tempDir);
            }
        }
    }

    private ExecutionResult executePython(String code, List<TestCase> testCases) {
        long startTime = System.currentTimeMillis();
        java.io.File tempDir = null;
        long maxCpuTime = 0;
        double maxMemoryMb = 0.0;
        try {
            String userDir = System.getProperty("user.dir");
            java.io.File workspaceTemp = new java.io.File(userDir, "temp_sandbox");
            if (!workspaceTemp.exists()) {
                workspaceTemp.mkdirs();
            }
            tempDir = java.nio.file.Files.createTempDirectory(workspaceTemp.toPath(), "py_").toFile();

            java.io.File pyFile = new java.io.File(tempDir, "submission.py");
            java.nio.file.Files.writeString(pyFile.toPath(), code);

            for (TestCase tc : testCases) {
                ProcessBuilder pb = new ProcessBuilder("python", pyFile.getAbsolutePath());
                pb.directory(tempDir);
                Process process = pb.start();

                com.nextlevelcoder.util.ProcessResourceTracker tracker = new com.nextlevelcoder.util.ProcessResourceTracker(process, "Python");
                tracker.start();

                try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(tc.input);
                    writer.flush();
                }

                boolean completed = process.waitFor(2, java.util.concurrent.TimeUnit.SECONDS);
                tracker.stop();

                maxCpuTime = Math.max(maxCpuTime, tracker.getCpuTimeMs());
                maxMemoryMb = Math.max(maxMemoryMb, tracker.getPeakMemoryMb());

                if (!completed) {
                    process.destroyForcibly();
                    return new ExecutionResult("Time Limit Exceeded", "Time Limit Exceeded: Code execution exceeded 2000ms.", System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }

                if (process.exitValue() != 0) {
                    String stderr = new String(process.getErrorStream().readAllBytes());
                    return new ExecutionResult("Runtime Error", "Runtime Error (exit code " + process.exitValue() + "):\n" + stderr, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }

                String stdout = new String(process.getInputStream().readAllBytes());
                if (!compareOutput(stdout, tc.expectedOutput)) {
                    return new ExecutionResult("Wrong Answer", "Wrong Answer.\nInput:\n" + tc.input + "\nExpected Output:\n" + tc.expectedOutput + "\nYour Output:\n" + stdout, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
                }
            }

            return new ExecutionResult("Accepted", null, System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);

        } catch (Exception e) {
            return new ExecutionResult("Runtime Error", "Internal Sandbox Error: " + e.getMessage(), System.currentTimeMillis() - startTime, maxCpuTime, maxMemoryMb);
        } finally {
            if (tempDir != null) {
                deleteDir(tempDir);
            }
        }
    }

    private RunResponse runCustomPython(String code, String customInput) {
        long startTime = System.currentTimeMillis();
        java.io.File tempDir = null;
        try {
            String userDir = System.getProperty("user.dir");
            java.io.File workspaceTemp = new java.io.File(userDir, "temp_sandbox");
            if (!workspaceTemp.exists()) {
                workspaceTemp.mkdirs();
            }
            tempDir = java.nio.file.Files.createTempDirectory(workspaceTemp.toPath(), "py_run_").toFile();

            java.io.File pyFile = new java.io.File(tempDir, "submission.py");
            java.nio.file.Files.writeString(pyFile.toPath(), code);

            ProcessBuilder pb = new ProcessBuilder("python", pyFile.getAbsolutePath());
            pb.directory(tempDir);
            Process process = pb.start();

            com.nextlevelcoder.util.ProcessResourceTracker tracker = new com.nextlevelcoder.util.ProcessResourceTracker(process, "Python");
            tracker.start();

            if (customInput != null && !customInput.isEmpty()) {
                try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(customInput);
                    if (!customInput.endsWith("\n")) {
                        writer.write("\n");
                    }
                    writer.flush();
                }
            } else {
                process.getOutputStream().close();
            }

            boolean completed = process.waitFor(2, java.util.concurrent.TimeUnit.SECONDS);
            tracker.stop();

            long elapsed = System.currentTimeMillis() - startTime;
            long cpuTime = tracker.getCpuTimeMs();
            double memoryMb = tracker.getPeakMemoryMb();

            if (!completed) {
                process.destroyForcibly();
                return RunResponse.builder()
                        .status("Time Limit Exceeded")
                        .stdout("")
                        .stderr("Time Limit Exceeded: Code execution exceeded 2000ms.")
                        .executionTimeMs((int) elapsed)
                        .cpuTimeMs((int) cpuTime)
                        .memoryMb(memoryMb)
                        .build();
            }

            String stdout = new String(process.getInputStream().readAllBytes());
            String stderr = new String(process.getErrorStream().readAllBytes());

            String status = process.exitValue() == 0 ? "Success" : "Runtime Error";

            return RunResponse.builder()
                    .status(status)
                    .stdout(stdout)
                    .stderr(stderr)
                    .executionTimeMs((int) elapsed)
                    .cpuTimeMs((int) cpuTime)
                    .memoryMb(memoryMb)
                    .build();

        } catch (Exception e) {
            return RunResponse.builder()
                    .status("Runtime Error")
                    .stdout("")
                    .stderr("Internal Sandbox Error: " + e.getMessage())
                    .executionTimeMs(0)
                    .cpuTimeMs(0)
                    .memoryMb(0.0)
                    .build();
        } finally {
            if (tempDir != null) {
                deleteDir(tempDir);
            }
        }
    }

    private boolean compareOutput(String actual, String expected) {
        if (actual == null && expected == null) return true;
        if (actual == null || expected == null) return false;
        
        String cleanActual = actual.replace("\r\n", "\n").trim();
        String cleanExpected = expected.replace("\r\n", "\n").trim();

        String[] actualLines = cleanActual.split("\n");
        String[] expectedLines = cleanExpected.split("\n");

        if (actualLines.length != expectedLines.length) {
            return false;
        }

        for (int i = 0; i < actualLines.length; i++) {
            if (!actualLines[i].trim().equals(expectedLines[i].trim())) {
                return false;
            }
        }

        return true;
    }

    private void deleteDir(java.io.File file) {
        java.io.File[] contents = file.listFiles();
        if (contents != null) {
            for (java.io.File f : contents) {
                deleteDir(f);
            }
        }
        file.delete();
    }

    @GetMapping
    public ResponseEntity<List<ProblemStatusResponse>> getAllProblems(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        List<CodingProblem> problems = codingProblemRepository.findAll();
        List<Submission> userSubmissions = submissionRepository.findByUser(user);

        List<ProblemStatusResponse> response = new ArrayList<>();
        boolean previousSolved = true; // The first problem is always unlocked

        for (int i = 0; i < problems.size(); i++) {
            CodingProblem prob = problems.get(i);
            
            // Check if user solved this specific problem
            boolean solved = userSubmissions.stream()
                    .anyMatch(s -> s.getCodingProblem().getId().equals(prob.getId()) && s.getStatus().equals("Accepted"));

            boolean unlocked = true;

            String schemaSql = null;
            if (prob.getSqlTemplate() != null) {
                Optional<SqlProblemMeta> metaOpt = SQL_PROBLEMS.stream()
                        .filter(p -> p.title.equalsIgnoreCase(prob.getTitle()))
                        .findFirst();
                if (metaOpt.isPresent()) {
                    schemaSql = metaOpt.get().schemaSql;
                }
            }

            boolean bookmarked = bookmarkService.isProblemBookmarked(user, prob.getId());

            response.add(ProblemStatusResponse.builder()
                    .id(prob.getId())
                    .title(prob.getTitle())
                    .description(prob.getDescription())
                    .difficulty(prob.getDifficulty())
                    .constraints(prob.getConstraints())
                    .javaTemplate(prob.getJavaTemplate())
                    .javascriptTemplate(prob.getJavascriptTemplate())
                    .sqlTemplate(prob.getSqlTemplate())
                    .unlocked(unlocked)
                    .solved(solved)
                    .category(getCategoryFromTitle(prob.getTitle()))
                    .schemaSql(schemaSql)
                    .bookmarked(bookmarked)
                    .build());

            // For the next problem to be unlocked, the current problem must be solved
            previousSolved = solved;
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodingProblem> getProblemById(@PathVariable Long id) {
        Optional<CodingProblem> problemOpt = codingProblemRepository.findById(id);
        if (problemOpt.isPresent()) {
            CodingProblem problem = problemOpt.get();
            problem.setCategory(getCategoryFromTitle(problem.getTitle()));
            if (problem.getSqlTemplate() != null) {
                Optional<SqlProblemMeta> metaOpt = SQL_PROBLEMS.stream()
                        .filter(p -> p.title.equalsIgnoreCase(problem.getTitle()))
                        .findFirst();
                if (metaOpt.isPresent()) {
                    problem.setSchemaSql(metaOpt.get().schemaSql);
                }
            }
            return ResponseEntity.ok(problem);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmissionResponse> submitSolution(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody SubmissionRequest request) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<CodingProblem> problemOpt = codingProblemRepository.findById(id);
        if (problemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        CodingProblem problem = problemOpt.get();

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Profile profile = profileRepository.findByUser(user).orElseThrow();

        String code = request.getCode();
        boolean isJava = request.getLanguage().equalsIgnoreCase("Java");
        boolean isSql = request.getLanguage().equalsIgnoreCase("SQL");
        boolean isHtml = request.getLanguage().equalsIgnoreCase("HTML") || request.getLanguage().equalsIgnoreCase("CSS") || request.getLanguage().equalsIgnoreCase("HTML/CSS");
        boolean isPython = request.getLanguage().equalsIgnoreCase("Python");
        String template = isSql ? problem.getSqlTemplate() : (isJava ? problem.getJavaTemplate() : (isPython ? null : problem.getJavascriptTemplate()));

        String status;
        String errorMessage;
        int executionTime;
        int xpEarned = 0;
        int cpuTime = 0;
        double memoryMb = 0.0;

        if (code == null || code.trim().length() < 5 || (!isHtml && template != null && code.trim().equals(template.trim()))) {
            status = "Compilation Error";
            errorMessage = "Compilation Error: Please enter your solution before running.";
            executionTime = 0;
        } else {
            String securityError = com.nextlevelcoder.util.CodeSanitizer.checkSecurity(code, request.getLanguage());
            if (securityError != null) {
                status = "Compilation Error";
                errorMessage = securityError;
                executionTime = 0;
            } else {
                if (isSql) {
                    SqlExecutionResult evalResult = executeSqlSandbox(code, problem.getTitle());
                    status = evalResult.status.equalsIgnoreCase("Success") ? "Accepted" : evalResult.status;
                    errorMessage = evalResult.errorMessage;
                    executionTime = (int) evalResult.timeMs;
                    cpuTime = 0;
                    memoryMb = 0.0;
                } else if (isHtml) {
                    ExecutionResult evalResult = executeHtmlCss(code, problem.getTitle());
                    status = evalResult.status;
                    errorMessage = evalResult.errorMessage;
                    executionTime = (int) evalResult.timeMs;
                    cpuTime = 0;
                    memoryMb = 0.0;
                } else {
                    List<TestCase> testCases = getTestCasesForProblem(problem.getTitle());
                    ExecutionResult evalResult;
                    if (isJava) {
                        evalResult = executeJava(code, testCases);
                    } else if (isPython) {
                        evalResult = executePython(code, testCases);
                    } else {
                        evalResult = executeJavaScript(code, testCases);
                    }
                    status = evalResult.status;
                    errorMessage = evalResult.errorMessage;
                    executionTime = (int) evalResult.timeMs;
                    cpuTime = (int) evalResult.cpuTimeMs;
                    memoryMb = evalResult.memoryMb;
                }
            }
        }

        // Save submission
        Submission submission = Submission.builder()
                .user(user)
                .codingProblem(problem)
                .language(request.getLanguage())
                .code(code)
                .status(status)
                .errorMessage(errorMessage)
                .executionTimeMs(executionTime)
                .cpuTimeMs(cpuTime)
                .memoryMb(memoryMb)
                .build();
        submissionRepository.save(submission);

        // Update statistics
        List<Submission> userSubmissions = submissionRepository.findByUser(user);
        long totalSubs = userSubmissions.size();
        long acceptedSubs = userSubmissions.stream().filter(s -> s.getStatus().equals("Accepted")).count();

        if (status.equals("Accepted")) {
            // Check if this problem was already solved by this user to avoid double solving XP
            List<Submission> previousSuccess = submissionRepository.findByUserAndCodingProblem(user, problem)
                    .stream().filter(s -> s.getStatus().equals("Accepted") && !s.getId().equals(submission.getId())).toList();

            if (previousSuccess.isEmpty()) {
                xpEarned = problem.getDifficulty().equalsIgnoreCase("Hard") ? 150 :
                           problem.getDifficulty().equalsIgnoreCase("Medium") ? 100 : 50;
                profile.setProblemsSolved(profile.getProblemsSolved() + 1);
                profile.setXp(profile.getXp() + xpEarned);

                // Update Level
                if (profile.getXp() >= 10000) {
                    profile.setLevel("Master");
                } else if (profile.getXp() >= 5000) {
                    profile.setLevel("Expert");
                } else if (profile.getXp() >= 2000) {
                    profile.setLevel("Advanced");
                } else if (profile.getXp() >= 500) {
                    profile.setLevel("Intermediate");
                } else {
                    profile.setLevel("Beginner");
                }
            }
        }

        // Calculate accuracy
        double accuracy = ((double) acceptedSubs / totalSubs) * 100.0;
        profile.setAccuracy(accuracy);
        profileRepository.save(profile);

        try {
            achievementService.checkAndAwardAchievements(user);
            goalService.updateDynamicGoals(user);
        } catch (Exception e) {
            System.err.println("Failed to dynamically check achievements/goals in ProblemController: " + e.getMessage());
        }

        return ResponseEntity.ok(SubmissionResponse.builder()
                .status(status)
                .errorMessage(errorMessage)
                .executionTimeMs(executionTime)
                .cpuTimeMs(cpuTime)
                .memoryMb(memoryMb)
                .xpEarned(xpEarned)
                .build());
    }

    private RunResponse runCustomJavaScript(String code, String customInput) {
        long startTime = System.currentTimeMillis();
        java.io.File tempDir = null;
        try {
            String userDir = System.getProperty("user.dir");
            java.io.File workspaceTemp = new java.io.File(userDir, "temp_sandbox");
            if (!workspaceTemp.exists()) {
                workspaceTemp.mkdirs();
            }
            tempDir = java.nio.file.Files.createTempDirectory(workspaceTemp.toPath(), "js_run_").toFile();

            java.io.File jsFile = new java.io.File(tempDir, "submission.js");
            java.nio.file.Files.writeString(jsFile.toPath(), code);

            ProcessBuilder pb = new ProcessBuilder("node", jsFile.getAbsolutePath());
            pb.directory(tempDir);
            Process process = pb.start();

            com.nextlevelcoder.util.ProcessResourceTracker tracker = new com.nextlevelcoder.util.ProcessResourceTracker(process, "JavaScript");
            tracker.start();

            if (customInput != null && !customInput.isEmpty()) {
                try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(customInput);
                    if (!customInput.endsWith("\n")) {
                        writer.write("\n");
                    }
                    writer.flush();
                }
            } else {
                process.getOutputStream().close();
            }

            boolean completed = process.waitFor(2, java.util.concurrent.TimeUnit.SECONDS);
            tracker.stop();

            long elapsed = System.currentTimeMillis() - startTime;
            long cpuTime = tracker.getCpuTimeMs();
            double memoryMb = tracker.getPeakMemoryMb();

            if (!completed) {
                process.destroyForcibly();
                return RunResponse.builder()
                        .status("Time Limit Exceeded")
                        .stdout("")
                        .stderr("Time Limit Exceeded: Code execution exceeded 2000ms.")
                        .executionTimeMs((int) elapsed)
                        .cpuTimeMs((int) cpuTime)
                        .memoryMb(memoryMb)
                        .build();
            }

            String stdout = new String(process.getInputStream().readAllBytes());
            String stderr = new String(process.getErrorStream().readAllBytes());

            String status = process.exitValue() == 0 ? "Success" : "Runtime Error";

            return RunResponse.builder()
                    .status(status)
                    .stdout(stdout)
                    .stderr(stderr)
                    .executionTimeMs((int) elapsed)
                    .cpuTimeMs((int) cpuTime)
                    .memoryMb(memoryMb)
                    .build();

        } catch (Exception e) {
            return RunResponse.builder()
                    .status("Runtime Error")
                    .stdout("")
                    .stderr("Internal Sandbox Error: " + e.getMessage())
                    .executionTimeMs(0)
                    .cpuTimeMs(0)
                    .memoryMb(0.0)
                    .build();
        } finally {
            if (tempDir != null) {
                deleteDir(tempDir);
            }
        }
    }

    private RunResponse runCustomJava(String code, String customInput) {
        long startTime = System.currentTimeMillis();
        java.io.File tempDir = null;
        try {
            String userDir = System.getProperty("user.dir");
            java.io.File workspaceTemp = new java.io.File(userDir, "temp_sandbox");
            if (!workspaceTemp.exists()) {
                workspaceTemp.mkdirs();
            }
            tempDir = java.nio.file.Files.createTempDirectory(workspaceTemp.toPath(), "java_run_").toFile();

            java.io.File javaFile = new java.io.File(tempDir, "Main.java");
            java.nio.file.Files.writeString(javaFile.toPath(), code);

            ProcessBuilder compilePb = new ProcessBuilder("javac", "Main.java");
            compilePb.directory(tempDir);
            Process compileProcess = compilePb.start();

            boolean compiled = compileProcess.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
            if (!compiled) {
                compileProcess.destroyForcibly();
                return RunResponse.builder()
                        .status("Compilation Error")
                        .stdout("")
                        .stderr("Compilation Timeout: javac compiler timed out.")
                        .executionTimeMs(0)
                        .cpuTimeMs(0)
                        .memoryMb(0.0)
                        .build();
            }

            if (compileProcess.exitValue() != 0) {
                String compileStderr = new String(compileProcess.getErrorStream().readAllBytes());
                return RunResponse.builder()
                        .status("Compilation Error")
                        .stdout("")
                        .stderr(compileStderr)
                        .executionTimeMs(0)
                        .cpuTimeMs(0)
                        .memoryMb(0.0)
                        .build();
            }

            ProcessBuilder pb = new ProcessBuilder("java", "-cp", ".", "Main");
            pb.directory(tempDir);
            Process process = pb.start();

            com.nextlevelcoder.util.ProcessResourceTracker tracker = new com.nextlevelcoder.util.ProcessResourceTracker(process, "Java");
            tracker.start();

            if (customInput != null && !customInput.isEmpty()) {
                try (java.io.BufferedWriter writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(customInput);
                    if (!customInput.endsWith("\n")) {
                        writer.write("\n");
                    }
                    writer.flush();
                }
            } else {
                process.getOutputStream().close();
            }

            boolean completed = process.waitFor(2, java.util.concurrent.TimeUnit.SECONDS);
            tracker.stop();

            long elapsed = System.currentTimeMillis() - startTime;
            long cpuTime = tracker.getCpuTimeMs();
            double memoryMb = tracker.getPeakMemoryMb();

            if (!completed) {
                process.destroyForcibly();
                return RunResponse.builder()
                        .status("Time Limit Exceeded")
                        .stdout("")
                        .stderr("Time Limit Exceeded: Code execution exceeded 2000ms.")
                        .executionTimeMs((int) elapsed)
                        .cpuTimeMs((int) cpuTime)
                        .memoryMb(memoryMb)
                        .build();
            }

            String stdout = new String(process.getInputStream().readAllBytes());
            String stderr = new String(process.getErrorStream().readAllBytes());

            String status = process.exitValue() == 0 ? "Success" : "Runtime Error";

            return RunResponse.builder()
                    .status(status)
                    .stdout(stdout)
                    .stderr(stderr)
                    .executionTimeMs((int) elapsed)
                    .cpuTimeMs((int) cpuTime)
                    .memoryMb(memoryMb)
                    .build();

        } catch (Exception e) {
            return RunResponse.builder()
                    .status("Compilation Error")
                    .stdout("")
                    .stderr("Internal Sandbox Error: " + e.getMessage())
                    .executionTimeMs(0)
                    .cpuTimeMs(0)
                    .memoryMb(0.0)
                    .build();
        } finally {
            if (tempDir != null) {
                deleteDir(tempDir);
            }
        }
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<RunResponse> runCode(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody SubmissionRequest request) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<CodingProblem> problemOpt = codingProblemRepository.findById(id);
        if (problemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String code = request.getCode();
        boolean isJava = request.getLanguage().equalsIgnoreCase("Java");
        boolean isSql = request.getLanguage().equalsIgnoreCase("SQL");
        boolean isHtml = request.getLanguage().equalsIgnoreCase("HTML") || request.getLanguage().equalsIgnoreCase("CSS") || request.getLanguage().equalsIgnoreCase("HTML/CSS");
        boolean isPython = request.getLanguage().equalsIgnoreCase("Python");
        String customInput = request.getCustomInput();

        String securityError = com.nextlevelcoder.util.CodeSanitizer.checkSecurity(code, request.getLanguage());
        if (securityError != null) {
            RunResponse response = RunResponse.builder()
                    .status("Compilation Error")
                    .stdout("")
                    .stderr(securityError)
                    .executionTimeMs(0)
                    .cpuTimeMs(0)
                    .memoryMb(0.0)
                    .build();
            return ResponseEntity.ok(response);
        }

        RunResponse response;
        if (isSql) {
            SqlExecutionResult evalResult = executeSqlSandbox(code, problemOpt.get().getTitle());
            response = RunResponse.builder()
                    .status(evalResult.status)
                    .stdout(evalResult.stdout)
                    .stderr(evalResult.errorMessage)
                    .executionTimeMs((int) evalResult.timeMs)
                    .cpuTimeMs(0)
                    .memoryMb(0.0)
                    .build();
        } else if (isHtml) {
            ExecutionResult evalResult = executeHtmlCss(code, problemOpt.get().getTitle());
            response = RunResponse.builder()
                    .status(evalResult.status)
                    .stdout(evalResult.status.equalsIgnoreCase("Accepted") ? "HTML/CSS Validation Successful!\nPreview rendered in Live Preview tab." : evalResult.errorMessage)
                    .stderr(evalResult.errorMessage)
                    .executionTimeMs((int) evalResult.timeMs)
                    .cpuTimeMs(0)
                    .memoryMb(0.0)
                    .build();
        } else {
            String finalInput = customInput;
            if (finalInput == null || finalInput.trim().isEmpty()) {
                List<TestCase> testCases = getTestCasesForProblem(problemOpt.get().getTitle());
                if (!testCases.isEmpty()) {
                    finalInput = testCases.get(0).input;
                }
            }
            if (isJava) {
                response = runCustomJava(code, finalInput);
            } else if (isPython) {
                response = runCustomPython(code, finalInput);
            } else {
                response = runCustomJavaScript(code, finalInput);
            }
        }

        return ResponseEntity.ok(response);
    }

    private static class SqlProblemMeta {
        String title;
        String schemaSql;
        String seedSql;
        String referenceQuery;

        SqlProblemMeta(String title, String schemaSql, String seedSql, String referenceQuery) {
            this.title = title;
            this.schemaSql = schemaSql;
            this.seedSql = seedSql;
            this.referenceQuery = referenceQuery;
        }
    }

    private static final List<SqlProblemMeta> SQL_PROBLEMS = List.of(
        new SqlProblemMeta(
            "High salary employees",
            "CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(255), salary INT, department_id INT);",
            "INSERT INTO employees VALUES (1, 'Alice', 70000, 1);" +
            "INSERT INTO employees VALUES (2, 'Bob', 50000, 1);" +
            "INSERT INTO employees VALUES (3, 'Charlie', 80000, 2);" +
            "INSERT INTO employees VALUES (4, 'David', 60000, 2);" +
            "INSERT INTO employees VALUES (5, 'Eve', 90000, 3);",
            "SELECT name, salary FROM employees WHERE salary > 60000 ORDER BY salary DESC;"
        ),
        new SqlProblemMeta(
            "Department headcounts",
            "CREATE TABLE departments (id INT PRIMARY KEY, name VARCHAR(255));" +
            "CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(255), salary INT, department_id INT);",
            "INSERT INTO departments VALUES (1, 'Engineering');" +
            "INSERT INTO departments VALUES (2, 'Sales');" +
            "INSERT INTO departments VALUES (3, 'Marketing');" +
            "INSERT INTO departments VALUES (4, 'HR');" +
            "INSERT INTO employees VALUES (1, 'Alice', 70000, 1);" +
            "INSERT INTO employees VALUES (2, 'Bob', 50000, 1);" +
            "INSERT INTO employees VALUES (3, 'Charlie', 80000, 2);" +
            "INSERT INTO employees VALUES (4, 'David', 60000, 2);" +
            "INSERT INTO employees VALUES (5, 'Eve', 90000, 3);",
            "SELECT d.name, COUNT(e.id) AS headcount FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name ORDER BY headcount DESC, d.name ASC;"
        ),
        new SqlProblemMeta(
            "Duplicate emails",
            "CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(255));",
            "INSERT INTO users VALUES (1, 'alice@example.com');" +
            "INSERT INTO users VALUES (2, 'bob@example.com');" +
            "INSERT INTO users VALUES (3, 'alice@example.com');" +
            "INSERT INTO users VALUES (4, 'charlie@example.com');" +
            "INSERT INTO users VALUES (5, 'bob@example.com');",
            "SELECT email FROM users GROUP BY email HAVING COUNT(email) > 1 ORDER BY email;"
        ),
        new SqlProblemMeta(
            "Find Customers Who Never Ordered",
            "CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(255));" +
            "CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT);",
            "INSERT INTO customers VALUES (1, 'Joe');" +
            "INSERT INTO customers VALUES (2, 'Henry');" +
            "INSERT INTO customers VALUES (3, 'Sam');" +
            "INSERT INTO customers VALUES (4, 'Max');" +
            "INSERT INTO orders VALUES (1, 3);" +
            "INSERT INTO orders VALUES (2, 1);",
            "SELECT name AS Customers FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);"
        ),
        new SqlProblemMeta(
            "Rank Salaries by Department",
            "CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(255), salary INT, department_id INT);",
            "INSERT INTO employees VALUES (1, 'Alice', 70000, 1);" +
            "INSERT INTO employees VALUES (2, 'Bob', 80000, 1);" +
            "INSERT INTO employees VALUES (3, 'Charlie', 80000, 2);" +
            "INSERT INTO employees VALUES (4, 'David', 90000, 2);",
            "SELECT department_id, name, salary, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank FROM employees;"
        )
    );

    private static class SqlExecutionResult {
        String status;
        String errorMessage;
        String stdout;
        long timeMs;
    }

    private SqlExecutionResult executeSqlSandbox(String userSql, String problemTitle) {
        SqlExecutionResult result = new SqlExecutionResult();
        result.timeMs = 0;
        
        Optional<SqlProblemMeta> metaOpt = SQL_PROBLEMS.stream()
                .filter(p -> p.title.equalsIgnoreCase(problemTitle))
                .findFirst();
        
        if (metaOpt.isEmpty()) {
            result.status = "Runtime Error";
            result.errorMessage = "SQL problem configuration not found.";
            return result;
        }
        
        SqlProblemMeta meta = metaOpt.get();
        String dbUrl = "jdbc:h2:mem:sandbox_" + System.nanoTime() + "_" + random.nextInt(1000);
        
        try {
            Class.forName("org.h2.Driver");
        } catch (ClassNotFoundException e) {
            result.status = "Runtime Error";
            result.errorMessage = "H2 Database driver not found.";
            return result;
        }
        
        try (java.sql.Connection conn = java.sql.DriverManager.getConnection(dbUrl);
             java.sql.Statement stmt = conn.createStatement()) {
            
            // 1. Run schema DDL
            stmt.execute(meta.schemaSql);
            
            // 2. Run seed SQL
            stmt.execute(meta.seedSql);
            
            // 3. Execute User Query
            long startTime = System.currentTimeMillis();
            List<String> userCols = new ArrayList<>();
            List<List<String>> userRows = new ArrayList<>();
            
            try (java.sql.ResultSet rs = stmt.executeQuery(userSql)) {
                java.sql.ResultSetMetaData rsmd = rs.getMetaData();
                int colCount = rsmd.getColumnCount();
                for (int i = 1; i <= colCount; i++) {
                    userCols.add(rsmd.getColumnLabel(i));
                }
                while (rs.next()) {
                    List<String> row = new ArrayList<>();
                    for (int i = 1; i <= colCount; i++) {
                        Object val = rs.getObject(i);
                        row.add(val == null ? "NULL" : val.toString());
                    }
                    userRows.add(row);
                }
            } catch (java.sql.SQLException e) {
                result.status = "Wrong Answer";
                result.errorMessage = "SQL Error: " + e.getMessage();
                return result;
            }
            
            result.timeMs = System.currentTimeMillis() - startTime;
            
            // 4. Execute Reference Query
            List<String> refCols = new ArrayList<>();
            List<List<String>> refRows = new ArrayList<>();
            
            try (java.sql.ResultSet rs = stmt.executeQuery(meta.referenceQuery)) {
                java.sql.ResultSetMetaData rsmd = rs.getMetaData();
                int colCount = rsmd.getColumnCount();
                for (int i = 1; i <= colCount; i++) {
                    refCols.add(rsmd.getColumnLabel(i));
                }
                while (rs.next()) {
                    List<String> row = new ArrayList<>();
                    for (int i = 1; i <= colCount; i++) {
                        Object val = rs.getObject(i);
                        row.add(val == null ? "NULL" : val.toString());
                    }
                    refRows.add(row);
                }
            }
            
            // 5. Compare results
            boolean match = true;
            String diffMessage = "";
            
            if (userCols.size() != refCols.size()) {
                match = false;
                diffMessage = "Column count mismatch: expected " + refCols.size() + " columns, got " + userCols.size();
            } else {
                for (int i = 0; i < userCols.size(); i++) {
                    if (!userCols.get(i).equalsIgnoreCase(refCols.get(i))) {
                        match = false;
                        diffMessage = "Column name mismatch at index " + (i + 1) + ": expected '" + refCols.get(i) + "', got '" + userCols.get(i) + "'";
                        break;
                    }
                }
            }
            
            if (match) {
                // If query is order-insensitive, sort rows before comparison
                boolean isOrderSensitive = meta.referenceQuery.toLowerCase().contains("order by");
                List<List<String>> sortedUserRows = new ArrayList<>(userRows);
                List<List<String>> sortedRefRows = new ArrayList<>(refRows);
                
                if (!isOrderSensitive) {
                    sortRows(sortedUserRows);
                    sortRows(sortedRefRows);
                }
                
                if (sortedUserRows.size() != sortedRefRows.size()) {
                    match = false;
                    diffMessage = "Row count mismatch: expected " + sortedRefRows.size() + " rows, got " + sortedUserRows.size();
                } else {
                    for (int r = 0; r < sortedUserRows.size(); r++) {
                        List<String> userRow = sortedUserRows.get(r);
                        List<String> refRow = sortedRefRows.get(r);
                        for (int c = 0; c < userRow.size(); c++) {
                            if (!userRow.get(c).equals(refRow.get(c))) {
                                match = false;
                                diffMessage = "Value mismatch in row " + (r + 1) + ", column '" + userCols.get(c) + "': expected '" + refRow.get(c) + "', got '" + userRow.get(c) + "'";
                                break;
                            }
                        }
                        if (!match) break;
                    }
                }
            }
            
            String userTable = formatAsciiTable(userCols, userRows);
            String refTable = formatAsciiTable(refCols, refRows);
            
            if (match) {
                result.status = "Success";
                result.stdout = userTable;
            } else {
                result.status = "Wrong Answer";
                result.errorMessage = diffMessage;
                result.stdout = "Wrong Answer!\n\n" +
                        "Mismatch details:\n" + diffMessage + "\n\n" +
                        "Your Output:\n" + userTable + "\n\n" +
                        "Expected Output:\n" + refTable;
            }
            
        } catch (java.sql.SQLException e) {
            result.status = "Runtime Error";
            result.errorMessage = "Database connection or execution failed: " + e.getMessage();
        }
        
        return result;
    }

    private void sortRows(List<List<String>> rows) {
        rows.sort((r1, r2) -> {
            int len = Math.min(r1.size(), r2.size());
            for (int i = 0; i < len; i++) {
                String s1 = r1.get(i);
                String s2 = r2.get(i);
                if (s1 == null) s1 = "";
                if (s2 == null) s2 = "";
                int cmp = s1.compareTo(s2);
                if (cmp != 0) return cmp;
            }
            return Integer.compare(r1.size(), r2.size());
        });
    }

    private String formatAsciiTable(List<String> columns, List<List<String>> rows) {
        if (columns == null || columns.isEmpty()) {
            return "";
        }
        int numCols = columns.size();
        int[] colWidths = new int[numCols];
        for (int i = 0; i < numCols; i++) {
            colWidths[i] = columns.get(i).length();
        }
        for (List<String> row : rows) {
            for (int i = 0; i < numCols && i < row.size(); i++) {
                String val = row.get(i);
                if (val != null) {
                    colWidths[i] = Math.max(colWidths[i], val.length());
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        String border = makeBorder(colWidths);
        sb.append(border).append("\n");

        sb.append("|");
        for (int i = 0; i < numCols; i++) {
            sb.append(" ").append(padRight(columns.get(i), colWidths[i])).append(" |");
        }
        sb.append("\n").append(border).append("\n");

        for (List<String> row : rows) {
            sb.append("|");
            for (int i = 0; i < numCols; i++) {
                String val = i < row.size() ? row.get(i) : "";
                if (val == null) val = "NULL";
                sb.append(" ").append(padRight(val, colWidths[i])).append(" |");
            }
            sb.append("\n");
        }
        sb.append(border);
        return sb.toString();
    }

    private String makeBorder(int[] colWidths) {
        StringBuilder sb = new StringBuilder();
        sb.append("+");
        for (int w : colWidths) {
            for (int j = 0; j < w + 2; j++) {
                sb.append("-");
            }
            sb.append("+");
        }
        return sb.toString();
    }

    private String padRight(String s, int n) {
        return String.format("%-" + n + "s", s);
    }

    private String getCategoryFromTitle(String title) {
        String lower = title.toLowerCase();
        if (lower.contains("salary") || lower.contains("department") || lower.contains("email") || lower.contains("sql") || lower.contains("customer") || lower.contains("ordered") || lower.contains("orders")) {
            return "SQL";
        }
        if (lower.contains("html") || lower.contains("css") || lower.contains("layout") || lower.contains("flexbox") || lower.contains("button") || lower.contains("grid") || lower.contains("web") || lower.contains("page") || lower.contains("form")) {
            return "HTML & CSS";
        }
        if (lower.contains("reverse a number") || lower.contains("palindrome number") || lower.contains("digit") || lower.contains("number") || lower.contains("armstrong") || lower.contains("strong") || lower.contains("fibonacci") || lower.contains("factorial")) {
            return "Digits";
        }
        if (lower.contains("string") || lower.contains("vowel") || lower.contains("consonant") || lower.contains("word") || lower.contains("sentence") || lower.contains("space") || lower.contains("character") || lower.contains("anagram") || lower.contains("sort characters")) {
            return "String";
        }
        if (lower.contains("array") || lower.contains("element") || lower.contains("merge") || lower.contains("search") || lower.contains("even and odd")) {
            return "Array";
        }
        if (lower.contains("pattern") || lower.contains("star") || lower.contains("triangle") || lower.contains("pyramid") || lower.contains("diamond") || lower.contains("floyd") || lower.contains("pascal") || lower.contains("alphabet") || lower.contains("square")) {
            return "Pattern";
        }
        return "Algorithms";
    }

    private ExecutionResult executeHtmlCss(String code, String problemTitle) {
        long startTime = System.currentTimeMillis();
        String lowerTitle = problemTitle.toLowerCase();
        String lowerCode = code.toLowerCase();

        List<String> errors = new ArrayList<>();

        if (lowerTitle.contains("centered flexbox card")) {
            if (!lowerCode.contains("display") || !lowerCode.contains("flex")) {
                errors.add("Missing flex container style ('display: flex').");
            }
            if (!lowerCode.contains("justify-content") || !lowerCode.contains("center")) {
                errors.add("Flex items are not horizontally centered ('justify-content: center').");
            }
            if (!lowerCode.contains("align-items") || !lowerCode.contains("center")) {
                errors.add("Flex items are not vertically centered ('align-items: center').");
            }
            if (!lowerCode.contains("<div") || !lowerCode.contains("class") || !lowerCode.contains("card")) {
                errors.add("Card container element not found (e.g. <div class=\"card\">).");
            }
        } else if (lowerTitle.contains("responsive 3-column grid")) {
            if (!lowerCode.contains("display") || !lowerCode.contains("grid")) {
                errors.add("Missing grid container style ('display: grid').");
            }
            if (!lowerCode.contains("grid-template-columns")) {
                errors.add("Missing grid layout template ('grid-template-columns').");
            }
            if (!lowerCode.contains("@media")) {
                errors.add("Missing responsive media query ('@media').");
            }
        } else if (lowerTitle.contains("custom form button")) {
            if (!lowerCode.contains("<button")) {
                errors.add("Missing <button> tag.");
            }
            if (!lowerCode.contains("background-color")) {
                errors.add("Button background-color is not styled.");
            }
            if (!lowerCode.contains("border-radius")) {
                errors.add("Button corners are not rounded ('border-radius').");
            }
        } else if (lowerTitle.contains("form with validation")) {
            if (!lowerCode.contains("<form")) {
                errors.add("Missing <form> tag.");
            }
            if (!lowerCode.contains("required")) {
                errors.add("Form inputs should have 'required' attributes.");
            }
            if (!lowerCode.contains("type=\"email\"") && !lowerCode.contains("type='email'")) {
                errors.add("Missing an email input field with email validation ('type=\"email\"').");
            }
        }

        long elapsed = System.currentTimeMillis() - startTime;

        if (!errors.isEmpty()) {
            StringBuilder sb = new StringBuilder("HTML/CSS Validation failed:\n");
            for (String err : errors) {
                sb.append("- ").append(err).append("\n");
            }
            return new ExecutionResult("Wrong Answer", sb.toString(), elapsed, 0, 0);
        }

        return new ExecutionResult("Accepted", null, elapsed, 0, 0);
    }
}
